import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  skinTypeTags: json("skinTypeTags").$type<string[]>(),
  concernTags: json("concernTags").$type<string[]>(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  skinType: text("skin_type").notNull(),
  concerns: json("concerns").$type<string[]>(),
  recommendedRoutine: json("recommended_routine"),
  recommendedProducts: json("recommended_products"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  messages: json("messages").$type<any[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
