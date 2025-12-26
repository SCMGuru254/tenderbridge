import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  salary: text("salary"),
  type: text("type").notNull(),
  category: text("category").notNull(),
  posted_at: timestamp("posted_at").defaultNow(),
  external_url: text("external_url"),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  full_name: text("full_name"),
  email: text("email").notNull(),
  avatar_url: text("avatar_url"),
  bio: text("bio"),
  role: text("role").default("candidate"),
  created_at: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  website: text("website"),
  user_id: text("user_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, posted_at: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, created_at: true });
export const insertCompanySchema = createInsertSchema(companies).omit({ id: true, created_at: true });

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
