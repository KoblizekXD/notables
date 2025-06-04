"use server";

import type { NoteSegment } from "@/components/segment-editor";
import db from "@/db/db";
import { note, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveNote(
  id: string,
  segments: NoteSegment[],
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

export async function uploadDescription(
  user_id: string,
  description: string,
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
