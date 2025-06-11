"use server";

import type { NoteSegment } from "@/components/segment-editor";
import db from "@/db/db";
import {
  author,
  collection,
  note,
  settings,
  tag,
  taggedEntity,
  user,
  work,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  createBucketIfNotExists,
  getSignedAvatarUrl,
  s3Client,
} from "@/lib/minio";
import {
  booleanToSidebarPosition,
  booleanToSidebarType,
  numberToTheme,
  settingsSchema,
  sidebarPositionToBoolean,
  sidebarTypeToBoolean,
  themeToNumber,
} from "@/lib/schemas";
import { and, desc, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";

export async function saveNote(
  id: string,
  segments: NoteSegment[]
): Promise<string | undefined> {
  const result = await db
    .update(note)
    .set({
      content: JSON.stringify(segments),
    })
    .where(eq(note.id, id))
    .execute();
  if (result.rowCount === 0) {
    return "Error saving note, please try again later or contact support.";
  }
}
export const getMostLikedNotes = async (
  userId: typeof user.id,
  limit: number
) =>
  await db
    .select()
    .from(note)
    .where(eq(userId, note.userId))
    .orderBy(note.updatedAt)
    .limit(limit);

export const getPopularCollections = async (limit: number) =>
  await db
    .select()
    .from(collection)
    .innerJoin(user, eq(collection.authorId, user.id))
    .orderBy(desc(collection.likes))
    .limit(limit);

export const getUser = async (userId: string) =>
  (await db.select().from(user).where(eq(user.id, userId)).limit(1))[0];

export const getUserNotes = async (userId: string, limit: number) =>
  await db
    .select()
    .from(note)
    .where(eq(note.userId, userId))
    .orderBy(desc(note.updatedAt))
    .limit(limit);

export async function uploadAvatar(
  formData: FormData
): Promise<{ success: boolean; imagePath?: string }> {
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  if (!file || !userId) return { success: false };
  const ext = file.name.split(".").findLast(() => true);
  if (!ext) return { success: false };
  const objectName = `avatars/${userId}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  try {
    const bucketName = "avatars";
    await createBucketIfNotExists(bucketName);
    await s3Client.putObject(bucketName, objectName, buffer);
    const imagePath = `${objectName}`;
    await db.update(user).set({ image: imagePath }).where(eq(user.id, userId));
    return { success: true, imagePath };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false };
  }
}

export async function uploadImage(
  file: File,
  name: string
): Promise<{ success: boolean; imagePath?: string; error?: string }> {
  if (!file) return { success: false, error: "No file provided" };
  const ext = file.name.split(".").findLast(() => true);
  if (!ext) return { success: false, error: "Invalid file extension" };
  const objectName = `images/${name}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  try {
    const bucketName = "images";
    await createBucketIfNotExists(bucketName);
    await s3Client.putObject(bucketName, objectName, buffer);
    return { success: true, imagePath: objectName };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, error: "Upload failed" };
  }
}

export const updateEmail = async (userId: string, email: string) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  try {
    await db.update(user).set({ email }).where(eq(user.id, userId));
    return true;
  } catch {
    return false;
  }
};

export const updateUsername = async (userId: string, name: string) => {
  try {
    await db.update(user).set({ name }).where(eq(user.id, userId));
    return true;
  } catch {
    return false;
  }
};

export async function uploadDescription(
  user_id: string,
  description: string
): Promise<string | undefined> {
  if (!description) return "Description cannot be empty";
  if (description.length > 200)
    return "Description cannot be longer than 200 characters";
  if (description.length < 3)
    return "Description cannot be shorter than 3 characters";
  if (description.includes("script"))
    return "Description cannot contain the word 'script'";
  const result = await db
    .update(user)
    .set({
      description,
      updatedAt: new Date(),
    })
    .where(eq(user.id, user_id))
    .execute();

  if (result.rowCount === 0)
    return "Error saving description, please try again later or contact support.";
  return undefined;
}

export async function getAvatarUrl(imagePath: string): Promise<string | null> {
  try {
    return await getSignedAvatarUrl(imagePath);
  } catch (error) {
    console.error("Error getting avatar URL:", error);
    return null;
  }
}

export interface UISettings {
  sidebarPosition: "left" | "right";
  sidebarType: "toggle" | "icon";
  theme: "system" | "light" | "dark";
}

export async function getSettings(): Promise<{
  settings: UISettings;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return { settings: getDefaultSettings(), error: "Unauthorized" };
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, session.user.id))
      .limit(1);

    let userSettings: UISettings;
    if (result.length === 0) {
      const defaultSettings = settingsSchema.parse({});
      await db.insert(settings).values({
        userId: session.user.id,
        ...defaultSettings,
      });
      userSettings = {
        sidebarPosition: booleanToSidebarPosition(
          defaultSettings.sidebarPosition
        ),
        sidebarType: booleanToSidebarType(defaultSettings.sidebarType),
        theme: numberToTheme(defaultSettings.theme),
      };
    } else {
      const dbSettings = result[0];
      userSettings = {
        sidebarPosition: booleanToSidebarPosition(dbSettings.sidebarPosition),
        sidebarType: booleanToSidebarType(dbSettings.sidebarType),
        theme: numberToTheme(dbSettings.theme),
      };
    }

    return { settings: userSettings };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      settings: getDefaultSettings(),
      error: "Failed to fetch settings",
    };
  }
}

export async function updateSettings(
  newSettings: Partial<UISettings>
): Promise<{ settings: UISettings; success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return {
        settings: getDefaultSettings(),
        success: false,
        error: "Unauthorized",
      };
    const dbSettings: Partial<{
      sidebarPosition: boolean;
      sidebarType: boolean;
      theme: number;
    }> = {};
    if (newSettings.sidebarPosition !== undefined)
      dbSettings.sidebarPosition = sidebarPositionToBoolean(
        newSettings.sidebarPosition
      );
    if (newSettings.sidebarType !== undefined)
      dbSettings.sidebarType = sidebarTypeToBoolean(newSettings.sidebarType);
    if (newSettings.theme !== undefined)
      dbSettings.theme = themeToNumber(newSettings.theme);
    const existingSettings = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, session.user.id))
      .limit(1);
    if (existingSettings.length > 0) {
      await db
        .update(settings)
        .set(dbSettings)
        .where(eq(settings.userId, session.user.id));
    } else {
      const defaultSettings = settingsSchema.parse({});
      await db.insert(settings).values({
        userId: session.user.id,
        sidebarPosition:
          dbSettings.sidebarPosition ?? defaultSettings.sidebarPosition,
        sidebarType: dbSettings.sidebarType ?? defaultSettings.sidebarType,
        theme: dbSettings.theme ?? defaultSettings.theme,
      });
    }
    const updatedResult = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, session.user.id))
      .limit(1);
    const updatedSettings = updatedResult[0];
    const uiSettings: UISettings = {
      sidebarPosition: booleanToSidebarPosition(
        updatedSettings.sidebarPosition
      ),
      sidebarType: booleanToSidebarType(updatedSettings.sidebarType),
      theme: numberToTheme(updatedSettings.theme),
    };
    return {
      success: true,
      settings: uiSettings,
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      settings: getDefaultSettings(),
      success: false,
      error: "Failed to update settings",
    };
  }
}

function getDefaultSettings(): UISettings {
  return {
    sidebarPosition: "left",
    sidebarType: "toggle",
    theme: "system",
  };
}

export const getAuthor = async (authorId: string) => {
  const authorWithTags = await db.query.author.findFirst({
    where: eq(author.id, authorId),
    with: {
      taggedEntities: {
        with: {
          tag: true,
        },
      },
    },
  });
  if (!authorWithTags) return null;
  return authorWithTags;
};

export const getTag = async (tagId: string) => {
  const tagWithAuthors = await db
    .select()
    .from(tag)
    .where(eq(tag.id, tagId))
    .limit(1);
  if (tagWithAuthors.length === 0) return null;
  return tagWithAuthors[0];
};

export async function getEntitiesByTagId({
  tagId,
  limit = 10,
  offset = 0,
}: {
  tagId: string;
  limit?: number;
  offset?: number;
}) {
  const results = await db
    .select({
      entityId: taggedEntity.entityId,
      entityType: taggedEntity.entityType,
    })
    .from(taggedEntity)
    .where(eq(taggedEntity.tagId, tagId))
    .limit(limit)
    .offset(offset);

  return results;
}

export async function getEntitiesByTagIdWithDetails({
  tagId,
  limit = 10,
  offset = 0,
}: {
  tagId: string;
  limit?: number;
  offset?: number;
}) {
  // First get the basic entity info
  const entityRefs = await db
    .select({
      entityId: taggedEntity.entityId,
      entityType: taggedEntity.entityType,
    })
    .from(taggedEntity)
    .where(eq(taggedEntity.tagId, tagId))
    .limit(limit < 1 ? 1 : limit)
    .offset(offset < 0 ? 0 : offset);
  const results = await Promise.all(
    entityRefs.map(async (ref) => {
      switch (ref.entityType) {
        case "author": {
          const author = await db.query.author.findFirst({
            where: (author, { eq }) => eq(author.id, ref.entityId),
            columns: {
              id: true,
              name: true,
            },
          });
          return { ...ref, entity: author };
        }
        case "work": {
          const work = await db.query.work.findFirst({
            where: (work, { eq }) => eq(work.id, ref.entityId),
            columns: {
              id: true,
              title: true,
            },
          });
          return { ...ref, entity: work };
        }
        case "note": {
          const note = await db.query.note.findFirst({
            where: (note, { eq }) => eq(note.id, ref.entityId),
            columns: {
              id: true,
              title: true,
            },
            with: {
              user: {
                columns: {
                  name: true,
                },
              },
            },
          });
          return { ...ref, entity: note };
        }
        default:
          return ref;
      }
    })
  );

  return results;
}

export async function getAuthorNotes(
  authorId: string,
  limit: number,
  offset: number
) {
  return await db
    .select({
      id: note.id,
      title: note.title,
      updatedAt: note.updatedAt,
      username: user.name,
    })
    .from(note)
    .where(and(eq(note.entityType, "author"), eq(note.entityId, authorId)))
    .leftJoin(user, eq(note.userId, user.id))
    .orderBy(desc(note.updatedAt))
    .offset(offset < 0 ? 0 : offset)
    .limit(limit);
}

export async function getAllAuthors() {
  return await db
    .select({
      id: author.id,
      name: author.name,
    })
    .from(author)
    .orderBy(author.name);
}

export async function getWorksByAuthor(authorId: string) {
  return await db
    .select({
      id: work.id,
      title: work.title,
    })
    .from(work)
    .where(eq(work.authorId, authorId))
    .orderBy(work.title);
}

export async function getAllWorks() {
  return await db
    .select({
      id: work.id,
      title: work.title,
      authorId: work.authorId,
    })
    .from(work)
    .leftJoin(author, eq(work.authorId, author.id))
    .orderBy(work.title);
}

export async function getWorksWithoutAuthor() {
  return await db
    .select({
      id: work.id,
      title: work.title,
    })
    .from(work)
    .where(isNull(work.authorId))
    .orderBy(work.title);
}

export async function createAuthor(
  name: string
): Promise<{ success: boolean; authorId?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!name.trim()) {
      return { success: false, error: "Author name is required" };
    }

    // Check if author already exists
    const existingAuthor = await db
      .select({ id: author.id })
      .from(author)
      .where(eq(author.name, name.trim()))
      .limit(1);

    if (existingAuthor.length > 0) {
      return { success: false, error: "Author with this name already exists" };
    }

    const result = await db
      .insert(author)
      .values({
        name: name.trim(),
      })
      .returning({ id: author.id });

    if (result.length === 0) {
      return { success: false, error: "Failed to create author" };
    }

    return { success: true, authorId: result[0].id };
  } catch (error) {
    console.error("Error creating author:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function createWork(
  title: string,
  authorId?: string
): Promise<{ success: boolean; workId?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!title.trim()) {
      return { success: false, error: "Work title is required" };
    }

    // If authorId is provided, verify the author exists
    if (authorId) {
      const authorExists = await db
        .select({ id: author.id })
        .from(author)
        .where(eq(author.id, authorId))
        .limit(1);

      if (authorExists.length === 0) {
        return { success: false, error: "Author not found" };
      }
    }

    const result = await db
      .insert(work)
      .values({
        title: title.trim(),
        authorId: authorId || null,
      })
      .returning({ id: work.id });

    if (result.length === 0) {
      return { success: false, error: "Failed to create work" };
    }

    return { success: true, workId: result[0].id };
  } catch (error) {
    console.error("Error creating work:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function createAuthorAndWork(
  authorName: string,
  workTitle: string
): Promise<{
  success: boolean;
  authorId?: string;
  workId?: string;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!authorName.trim()) {
      return { success: false, error: "Author name is required" };
    }

    if (!workTitle.trim()) {
      return { success: false, error: "Work title is required" };
    }

    // Check if author already exists
    const existingAuthor = await db
      .select({ id: author.id })
      .from(author)
      .where(eq(author.name, authorName.trim()))
      .limit(1);

    if (existingAuthor.length > 0) {
      return { success: false, error: "Author with this name already exists" };
    }

    // Create author first
    const authorResult = await db
      .insert(author)
      .values({
        name: authorName.trim(),
      })
      .returning({ id: author.id });

    if (authorResult.length === 0) {
      return { success: false, error: "Failed to create author" };
    }

    const newAuthorId = authorResult[0].id;

    // Create work with the new author
    const workResult = await db
      .insert(work)
      .values({
        title: workTitle.trim(),
        authorId: newAuthorId,
      })
      .returning({ id: work.id });

    if (workResult.length === 0) {
      // If work creation fails, we should ideally rollback the author creation
      // For now, we'll just return an error
      return { success: false, error: "Failed to create work" };
    }

    return {
      success: true,
      authorId: newAuthorId,
      workId: workResult[0].id,
    };
  } catch (error) {
    console.error("Error creating author and work:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function createNote(
  title: string,
  content: string,
  entityType: "author" | "work",
  entityId: string
): Promise<{ success: boolean; noteId?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!title.trim()) {
      return { success: false, error: "Title is required" };
    }

    // Verify the entity exists
    if (entityType === "author") {
      const authorExists = await db
        .select({ id: author.id })
        .from(author)
        .where(eq(author.id, entityId))
        .limit(1);

      if (authorExists.length === 0) {
        return { success: false, error: "Author not found" };
      }
    } else if (entityType === "work") {
      const workExists = await db
        .select({ id: work.id })
        .from(work)
        .where(eq(work.id, entityId))
        .limit(1);

      if (workExists.length === 0) {
        return { success: false, error: "Work not found" };
      }
    }

    // Create empty content structure for the editor
    const emptyContent = content.trim()
      ? JSON.stringify([{ type: "text", content: { text: content.trim() } }])
      : JSON.stringify([]);

    const result = await db
      .insert(note)
      .values({
        title: title.trim(),
        content: emptyContent,
        entityType,
        entityId,
        userId: session.user.id,
      })
      .returning({ id: note.id });

    if (result.length === 0) {
      return { success: false, error: "Failed to create note" };
    }

    return { success: true, noteId: result[0].id };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getSignedImageUrl(
  objectName: string
): Promise<string | null> {
  if (!objectName) return null;
  const bucketName = "images";
  const expirySeconds = 60 * 60;
  try {
    await createBucketIfNotExists(bucketName);
    const url = await s3Client.presignedGetObject(
      bucketName,
      objectName,
      expirySeconds
    );
    return url;
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return null;
  }
}

export async function signOutAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return { success: false, error: "No active session found" };
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}
