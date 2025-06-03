"use server";

import type { NoteSegment } from "@/components/segment-editor";
import db from "@/db/db";
import { author, collection, note, tag, taggedEntity, user } from "@/db/schema";
import { createBucketIfNotExists, s3Client } from "@/lib/minio";
import { type InferSelectModel, and, desc, eq } from "drizzle-orm";

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
  await db.select().from(user).where(eq(user.id, userId)).limit(1);

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
    const bucketName = process.env.S3_BUCKET as string;
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

export const getAuthor = async (
  authorId: string
): Promise<InferSelectModel<typeof author> | undefined> => {
  const res = await db
    .select()
    .from(author)
    .where(eq(author.id, authorId))
    .innerJoin(taggedEntity, eq(tag.id, taggedEntity.tagId))
    .limit(1);
  if (res.length === 0) return undefined;
  return res[0];
};

export const getAuthorsNotes = async (
  authorId: string,
  limit: number
): Promise<InferSelectModel<typeof note>[]> => {
  return await db
    .select()
    .from(note)
    .where(and(eq(note.entityId, authorId), eq(note.entityType, "author")))
    .orderBy(desc(note.updatedAt))
    .limit(limit);
};
