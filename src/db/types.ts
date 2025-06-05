import type { InferSelectModel } from "drizzle-orm";
import type { collection, note, user } from "./schema";

type Note = InferSelectModel<typeof note>;
type Collection = InferSelectModel<typeof collection>;
type User = InferSelectModel<typeof user>;

export type { Note, Collection, User };
