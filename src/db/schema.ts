import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const entityKind = pgEnum("entity_kind", ["work", "note", "author"]);

export const tag = pgTable("tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const taggedEntity = pgTable(
  "tagged_entity",
  {
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),

    entityId: uuid("entity_id").notNull(),
    entityType: entityKind("entity_type").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.tagId, table.entityId, table.entityType] }),
  ],
);

export const taggedEntityRelations = relations(taggedEntity, ({ one }) => ({
  tag: one(tag, {
    fields: [taggedEntity.tagId],
    references: [tag.id],
  }),
  author: one(author, {
    fields: [taggedEntity.entityId],
    references: [author.id],
    relationName: "author_relation",
  }),
  work: one(work, {
    fields: [taggedEntity.entityId],
    references: [work.id],
    relationName: "work_relation",
  }),
  note: one(note, {
    fields: [taggedEntity.entityId],
    references: [note.id],
  }),
}));

export const author = pgTable("author", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const tagRelations = relations(tag, ({ many }) => ({
  taggedEntities: many(taggedEntity),
}));

export const authorRelations = relations(author, ({ many }) => ({
  taggedEntities: many(taggedEntity, {
    relationName: "author_relation",
  }),
}));

export const work = pgTable("work", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  authorId: uuid("author_id").references(() => author.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const workRelations = relations(work, ({ many }) => ({
  taggedEntities: many(taggedEntity, {
    relationName: "work_relation",
  }),
}));

export const note = pgTable("note", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  title: text("title"),
  entityType: entityKind("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const comment = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  noteId: uuid("note_id")
    .notNull()
    .references(() => note.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const favorite = pgTable(
  "favorite",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    entityId: uuid("entity_id").notNull(),
    entityType: entityKind("entity_type").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.entityId, table.entityType] }),
  ],
);

export const collectionNote = pgTable(
  "collection_note",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
    noteId: uuid("note_id")
      .notNull()
      .references(() => note.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.collectionId, table.noteId] })],
);

export const collection = pgTable("collection", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  public: boolean("public").notNull().default(false),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const collectionRelations = relations(collection, ({ one, many }) => ({
  author: one(user, {
    fields: [collection.authorId],
    references: [user.id],
  }),
  collectionNotes: many(collectionNote),
}));

export const collectionNoteRelations = relations(collectionNote, ({ one }) => ({
  collection: one(collection, {
    fields: [collectionNote.collectionId],
    references: [collection.id],
  }),
  note: one(note, {
    fields: [collectionNote.noteId],
    references: [note.id],
  }),
}));

export const noteRelations = relations(note, ({ one, many }) => ({
  user: one(user, {
    fields: [note.userId],
    references: [user.id],
  }),
  collectionNotes: many(collectionNote),
}));

export const userRelations = relations(user, ({ many }) => ({
  collections: many(collection),
}));

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sidebarPosition: boolean().notNull().default(false),
  sidebarType: boolean().notNull().default(false),
  theme: smallint().notNull().default(0), // 0- system, 1- light, 2- dark
});
