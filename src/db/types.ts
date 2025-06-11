import type { InferSelectModel } from "drizzle-orm";
import type { collection, note, user, settings } from "./schema";

type Note = InferSelectModel<typeof note>;
type Collection = InferSelectModel<typeof collection>;
type User = InferSelectModel<typeof user>;
type SettingsDB = InferSelectModel<typeof settings>;

export type { Note, Collection, User, SettingsDB };
