"use server";

import type { NoteSegment } from "@/components/segment-editor";
import db from "@/db/db";
import { author, collection, note, tag, taggedEntity, user } from "@/db/schema";
import { createBucketIfNotExists, s3Client } from "@/lib/minio";
import { and, desc, eq } from "drizzle-orm";

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
): Promise<{ success: boolean }> {
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
    return { success: true };
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
  if (!description) {
    return "Description cannot be empty";
  }
  if (description.length > 200) {
    return "Description cannot be longer than 200 characters";
  }
  if (description.length < 3) {
    return "Description cannot be shorter than 3 characters";
  }
  if (description.includes("script")) {
    return "Description cannot contain the word 'script'";
  }

  const result = await db
    .update(user)
    .set({
      description,
      updatedAt: new Date(),
    })
    .where(eq(user.id, user_id))
    .execute();

  if (result.rowCount === 0) {
    return "Error saving description, please try again later or contact support.";
  }

  return undefined;
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

  // Then fetch details for each entity type
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

export async function getSignedImageUrl(
  objectName: string,
): Promise<string | null> {
  if (!objectName) return null;
  const bucketName = "images";
  const expirySeconds = 60 * 60;
  try {
    const url = await s3Client.presignedGetObject(
      bucketName,
      objectName,
      expirySeconds,
    );
    return url;
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return null;
  }
}
