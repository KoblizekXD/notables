"use server";

import type { NoteSegment } from "@/components/note/segment-editor";
import type { Result } from "@/components/search/dynamic-command";
import db from "@/db/db";
import {
  author,
  collection,
  collectionNote,
  note,
  settings,
  tag,
  taggedEntity,
  user,
  work,
} from "@/db/schema";
import type { Author, Note, User, Work } from "@/db/types";
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
import { and, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
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

export const getPublicNewestCollections = async (limit: number) =>
  await db
    .select()
    .from(collection)
    .innerJoin(user, eq(collection.authorId, user.id))
    .where(eq(collection.public, true))
    .orderBy(desc(collection.createdAt))
    .limit(limit);

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

export async function getAllPublicCollections(
  searchQuery?: string,
  sortBy: SortOption = "newest"
): Promise<
  {
    id: string;
    name: string;
    description: string | null;
    public: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
  }[]
> {
  try {
    const whereConditions = [eq(collection.public, true)];

    if (searchQuery?.trim()) {
      const searchTerm = `%${searchQuery.trim().toLowerCase()}%`;
      const condition = or(
        sql`LOWER(${collection.name}) LIKE ${searchTerm}`,
        sql`LOWER(${collection.description}) LIKE ${searchTerm}`,
        sql`LOWER(${user.name}) LIKE ${searchTerm}`
      );
      if (condition) whereConditions.push(condition);
    }
    const baseQuery = db
      .select({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        public: collection.public,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(collection)
      .innerJoin(user, eq(collection.authorId, user.id))
      .where(and(...whereConditions));
    const result =
      sortBy === "oldest"
        ? await baseQuery.orderBy(collection.createdAt)
        : sortBy === "name-asc"
        ? await baseQuery.orderBy(collection.name)
        : sortBy === "name-desc"
        ? await baseQuery.orderBy(desc(collection.name))
        : await baseQuery.orderBy(desc(collection.createdAt)); // default: "newest"

    return result;
  } catch (error) {
    console.error("Error fetching public collections:", error);
    return [];
  }
}

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

export const getNote = async (
  id: string
): Promise<{
  note: Note;
  user: User;
  work?: Work | null;
  author?: Author | null;
} | null> => {
  if (!id) return null;

  const result = await db
    .select()
    .from(note)
    .where(eq(note.id, id))
    .innerJoin(user, eq(note.userId, user.id))
    .leftJoin(
      work,
      and(eq(note.entityType, "work"), eq(note.entityId, work.id))
    )
    .leftJoin(
      author,
      and(eq(note.entityType, "author"), eq(note.entityId, author.id))
    )
    .limit(1);

  if (result.length === 0) return null;
  return result[0];
};

export async function uploadDescription(
  user_id: string,
  description: string
): Promise<string | undefined> {
  const descriptionTrimmed = description.trim();

  if (descriptionTrimmed.length === 0) return "Description cannot be empty";
  if (descriptionTrimmed.length > 500)
    return "Description cannot be longer than 500 characters";
  if (descriptionTrimmed.length < 2)
    return "Description cannot be shorter than 2 characters";

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
    if (!session?.user.id) return { success: false, error: "Unauthorized" };
    if (!title.trim())
      return { success: false, error: "Work title is required" };
    if (authorId) {
      const authorExists = await db
        .select({ id: author.id })
        .from(author)
        .where(eq(author.id, authorId))
        .limit(1);
      if (authorExists.length === 0)
        return { success: false, error: "Author not found" };
    }
    const result = await db
      .insert(work)
      .values({
        title: title.trim(),
        authorId: authorId || null,
      })
      .returning({ id: work.id });
    if (result.length === 0)
      return { success: false, error: "Failed to create work" };
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

    if (!session?.user.id) return { success: false, error: "Unauthorized" };
    if (!authorName.trim())
      return { success: false, error: "Author name is required" };
    if (!workTitle.trim())
      return { success: false, error: "Work title is required" };
    const existingAuthor = await db
      .select({ id: author.id })
      .from(author)
      .where(eq(author.name, authorName.trim()))
      .limit(1);
    if (existingAuthor.length > 0)
      return { success: false, error: "Author with this name already exists" };
    const authorResult = await db
      .insert(author)
      .values({
        name: authorName.trim(),
      })
      .returning({ id: author.id });
    if (authorResult.length === 0)
      return { success: false, error: "Failed to create author" };
    const newAuthorId = authorResult[0].id;
    const workResult = await db
      .insert(work)
      .values({
        title: workTitle.trim(),
        authorId: newAuthorId,
      })
      .returning({ id: work.id });
    if (workResult.length === 0)
      return { success: false, error: "Failed to create work" };
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
    if (!session?.user.id) return { success: false, error: "Unauthorized" };
    if (!title.trim()) return { success: false, error: "Title is required" };
    if (entityType === "author") {
      const authorExists = await db
        .select({ id: author.id })
        .from(author)
        .where(eq(author.id, entityId))
        .limit(1);

      if (authorExists.length === 0)
        return { success: false, error: "Author not found" };
    } else if (entityType === "work") {
      const workExists = await db
        .select({ id: work.id })
        .from(work)
        .where(eq(work.id, entityId))
        .limit(1);

      if (workExists.length === 0)
        return { success: false, error: "Work not found" };
    }
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
    if (result.length === 0)
      return { success: false, error: "Failed to create note" };
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

export async function createCollection(
  name: string,
  description?: string,
  isPublic = false
): Promise<{ success: boolean; collectionId?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) return { success: false, error: "Unauthorized" };
    if (!name.trim())
      return { success: false, error: "Collection name is required" };

    if (name.trim().length > 100)
      return {
        success: false,
        error: "Collection name cannot exceed 100 characters",
      };
    if (description && description.length > 500)
      return {
        success: false,
        error: "Description cannot exceed 500 characters",
      };

    const result = await db
      .insert(collection)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
        public: isPublic,
        authorId: session.user.id,
      })
      .returning({ id: collection.id });

    if (result.length === 0)
      return { success: false, error: "Failed to create collection" };
    return {
      success: true,
      collectionId: result[0].id,
    };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCollection(collectionId: string): Promise<{
  id: string;
  name: string;
  description: string | null;
  public: boolean;
  authorId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  collectionNotes: Array<{
    note: {
      id: string;
      title: string | null;
      content: string;
      entityType: "author" | "work" | "note";
      entityId: string;
      createdAt: Date | null;
      updatedAt: Date | null;
      user: {
        id: string;
        name: string;
        image: string | null;
      };
    };
  }>;
} | null> {
  try {
    const result = await db
      .select({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        public: collection.public,
        authorId: collection.authorId,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(collection)
      .innerJoin(user, eq(collection.authorId, user.id))
      .where(eq(collection.id, collectionId))
      .limit(1);
    if (result.length === 0) return null;
    const collectionNotesRaw = await db
      .select({
        noteId: note.id,
        noteTitle: note.title,
        noteContent: note.content,
        noteEntityType: note.entityType,
        noteEntityId: note.entityId,
        noteCreatedAt: note.createdAt,
        noteUpdatedAt: note.updatedAt,
        userId: user.id,
        userName: user.name,
        userImage: user.image,
      })
      .from(collectionNote)
      .innerJoin(note, eq(collectionNote.noteId, note.id))
      .innerJoin(user, eq(note.userId, user.id))
      .where(eq(collectionNote.collectionId, collectionId))
      .orderBy(desc(note.updatedAt));
    const collectionNotes = collectionNotesRaw.map((row) => ({
      note: {
        id: row.noteId,
        title: row.noteTitle,
        content: row.noteContent,
        entityType: row.noteEntityType,
        entityId: row.noteEntityId,
        createdAt: row.noteCreatedAt,
        updatedAt: row.noteUpdatedAt,
        user: {
          id: row.userId,
          name: row.userName,
          image: row.userImage,
        },
      },
    }));

    return {
      ...result[0],
      collectionNotes,
    };
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
}

export async function getUserCollections(userId?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const targetUserId = userId || session?.user.id;
    if (!targetUserId) return [];
    const result = await db
      .select({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        public: collection.public,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
      })
      .from(collection)
      .where(eq(collection.authorId, targetUserId))
      .orderBy(desc(collection.updatedAt));
    return result;
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return [];
  }
}

export async function updateCollection(
  collectionId: string,
  name: string,
  description?: string,
  isPublic?: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) return { success: false, error: "Unauthorized" };
    if (!name.trim())
      return { success: false, error: "Collection name is required" };
    if (name.trim().length > 100)
      return {
        success: false,
        error: "Collection name cannot exceed 100 characters",
      };

    if (description && description.length > 500)
      return {
        success: false,
        error: "Description cannot exceed 500 characters",
      };
    const existingCollection = await db
      .select({ authorId: collection.authorId })
      .from(collection)
      .where(eq(collection.id, collectionId))
      .limit(1);

    if (existingCollection.length === 0)
      return { success: false, error: "Collection not found" };
    if (existingCollection[0].authorId !== session.user.id)
      return {
        success: false,
        error: "You don't have permission to edit this collection",
      };
    const updateData: {
      name: string;
      description: string | null;
      updatedAt: Date;
      public?: boolean;
    } = {
      name: name.trim(),
      description: description?.trim() || null,
      updatedAt: new Date(),
    };
    if (isPublic !== undefined) updateData.public = isPublic;
    const result = await db
      .update(collection)
      .set(updateData)
      .where(eq(collection.id, collectionId))
      .execute();
    if (result.rowCount === 0)
      return { success: false, error: "Failed to update collection" };
    return { success: true };
  } catch (error) {
    console.error("Error updating collection:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteCollection(
  collectionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) return { success: false, error: "Unauthorized" };
    const existingCollection = await db
      .select({ authorId: collection.authorId })
      .from(collection)
      .where(eq(collection.id, collectionId))
      .limit(1);
    if (existingCollection.length === 0)
      return { success: false, error: "Collection not found" };

    if (existingCollection[0].authorId !== session.user.id)
      return {
        success: false,
        error: "You don't have permission to delete this collection",
      };
    const result = await db
      .delete(collection)
      .where(eq(collection.id, collectionId))
      .execute();
    if (result.rowCount === 0)
      return { success: false, error: "Failed to delete collection" };
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function addNoteToCollection(
  collectionId: string,
  noteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) return { success: false, error: "Unauthorized" };
    const existingCollection = await db
      .select({ authorId: collection.authorId })
      .from(collection)
      .where(eq(collection.id, collectionId))
      .limit(1);
    if (existingCollection.length === 0)
      return { success: false, error: "Collection not found" };
    if (existingCollection[0].authorId !== session.user.id)
      return {
        success: false,
        error: "You don't have permission to modify this collection",
      };
    const existingNote = await db
      .select({ id: note.id })
      .from(note)
      .where(eq(note.id, noteId))
      .limit(1);
    if (existingNote.length === 0)
      return { success: false, error: "Note not found" };
    const existingRelation = await db
      .select()
      .from(collectionNote)
      .where(
        and(
          eq(collectionNote.collectionId, collectionId),
          eq(collectionNote.noteId, noteId)
        )
      )
      .limit(1);
    if (existingRelation.length > 0)
      return { success: false, error: "Note is already in this collection" };
    await db.insert(collectionNote).values({
      collectionId,
      noteId,
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding note to collection:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function removeNoteFromCollection(
  collectionId: string,
  noteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) return { success: false, error: "Unauthorized" };
    const existingCollection = await db
      .select({ authorId: collection.authorId })
      .from(collection)
      .where(eq(collection.id, collectionId))
      .limit(1);
    if (existingCollection.length === 0)
      return { success: false, error: "Collection not found" };
    if (existingCollection[0].authorId !== session.user.id)
      return {
        success: false,
        error: "You don't have permission to modify this collection",
      };
    const result = await db
      .delete(collectionNote)
      .where(
        and(
          eq(collectionNote.collectionId, collectionId),
          eq(collectionNote.noteId, noteId)
        )
      )
      .execute();
    if (result.rowCount === 0)
      return { success: false, error: "Note was not in this collection" };
    return { success: true };
  } catch (error) {
    console.error("Error removing note from collection:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCollectionNotes(collectionId: string) {
  try {
    const result = await db
      .select({
        id: note.id,
        title: note.title,
        content: note.content,
        entityType: note.entityType,
        entityId: note.entityId,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        userId: user.id,
        userName: user.name,
        userImage: user.image,
      })
      .from(collectionNote)
      .innerJoin(note, eq(collectionNote.noteId, note.id))
      .innerJoin(user, eq(note.userId, user.id))
      .where(eq(collectionNote.collectionId, collectionId))
      .orderBy(desc(note.updatedAt));
    return result.map((row) => ({
      ...row,
      user: {
        id: row.userId,
        name: row.userName,
        image: row.userImage,
      },
    }));
  } catch (error) {
    console.error("Error fetching collection notes:", error);
    return [];
  }
}

export async function searchQuery(query: string): Promise<{
  notes: Result[];
  works: Result[];
  authors: Result[];
}> {
  if (!query || query.trim().length === 0) return { notes: [], works: [], authors: [] };
  const searchTerm = `%${query.trim()}%`;

  return {
    works: (
      await db
        .select({
          id: work.id,
          title: work.title,
          description: author.name,
        })
        .from(work)
        .where(ilike(work.title, searchTerm))
        .innerJoin(author, eq(work.authorId, author.id))
    ).map(
      (row) =>
        ({
          id: row.id,
          name: row.title,
          description: row.description || "No author",
          type: "work",
        } satisfies Result)
    ),
    notes: (
      await db
        .select({
          id: note.id,
          title: note.title,
          description: user.name,
        })
        .from(note)
        .where(ilike(note.title, searchTerm))
        .innerJoin(user, eq(note.userId, user.id))
    ).map(
      (row) =>
        ({
          id: row.id,
          name: row.title || "Untitled Note",
          description: `By ${row.description}`,
          type: "note",
        } satisfies Result)
    ),
    authors: (
      await db
        .select({
          id: author.id,
          title: author.name,
        })
        .from(author)
        .where(ilike(author.name, searchTerm))
    ).map(
      (row) =>
        ({
          id: row.id,
          name: row.title,
          description: "",
          type: "author",
        } satisfies Result)
    ),
  };
}
