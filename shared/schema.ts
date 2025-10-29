import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Coin analysis response schema
export const coinAnalysisSchema = z.object({
  coinType: z.string(),
  country: z.string(),
  countryFlag: z.string(),
  denomination: z.string(),
  year: z.union([z.string(), z.number()]).transform(val => String(val)).optional(),
  confidence: z.number().min(0).max(100).optional(),
  material: z.string().optional(),
  value: z.number(),
  currency: z.string(),
});

export type CoinAnalysis = z.infer<typeof coinAnalysisSchema>;
