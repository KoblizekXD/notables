import type { InferSelectModel } from "drizzle-orm";
import type { author, collection, note, settings, user, work } from "./schema";

type Note = InferSelectModel<typeof note>;
type Collection = InferSelectModel<typeof collection>;
type User = InferSelectModel<typeof user>;
type SettingsDB = InferSelectModel<typeof settings>;
type Work = InferSelectModel<typeof work>;
type Author = InferSelectModel<typeof author>;

export type { Note, Collection, User, SettingsDB, Work, Author };
