"use server";

import type { NoteSegment } from "@/components/segment-editor";
import db from "@/db/db";
import { note } from "@/db/schema";
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
