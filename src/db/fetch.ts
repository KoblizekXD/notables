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

const getUser = async (userId: typeof user.id) =>
  await db.select().from(user).where(eq(user.id, userId)).limit(1);

export { getMostLikedNotes, getPopularCollections };
