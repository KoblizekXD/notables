"use server";

import { collection, note, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import db from "./db";

const getMostLikedNotes = async (userId: typeof user.id, limit: number) =>
  await db
    .select()
    .from(note)
    .where(eq(userId, note.userId))
    .orderBy(note.updatedAt)
    .limit(limit);

const getPopularCollections = async (limit: number) =>
  await db
    .select()
    .from(collection)
    .innerJoin(user, eq(collection.authorId, user.id))
    .orderBy(desc(collection.likes))
    .limit(limit);

const getUser = async (userId: string) =>
  (await db.select().from(user).where(eq(user.id, userId)).limit(1))[0];

const getUserNotes = async (userId: string, limit: number) => {
  return await db.select({ title: note.title, createdAt: note.createdAt, entityType: note.entityType, id: note.id }).from(note).where(eq(note.userId, userId))
    .limit(limit)
    .orderBy(desc(note.updatedAt));
}

const updateUserDescription = async (userId: string, description: string) => {
  await db.update(user).set({ description: user.description }).where(eq(user.id, userId));
}

export { getMostLikedNotes, getPopularCollections, getUserNotes, getUser };
