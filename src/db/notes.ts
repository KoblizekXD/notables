"use server";

import { eq, type InferSelectModel } from "drizzle-orm";
import { type user, note } from "@/db/schema";
import db from "./db";

type Note = InferSelectModel<typeof note>;

const getRecentNotes = async (userId: typeof user.id, limit: number) =>
  await db
    .select()
    .from(note)
    .where(eq(userId, note.userId))
    .orderBy(note.updatedAt)
    .limit(limit);

export { getRecentNotes };
export type { Note };
