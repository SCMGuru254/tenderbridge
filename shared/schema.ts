import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  salary: text("salary"),
  type: text("type").notNull(), // full-time, part-time, contract
  category: text("category").notNull(), // logistics, procurement, etc.
  posted_at: timestamp("posted_at").defaultNow(),
  external_url: text("external_url"),
});

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, posted_at: true });
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  full_name: text("full_name"),
  email: text("email").notNull(),
  avatar_url: text("avatar_url"),
  bio: text("bio"),
  role: text("role").default("candidate"), // candidate, employer, admin
  created_at: timestamp("created_at").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, created_at: true });
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
