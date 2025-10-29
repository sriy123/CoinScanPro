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
  isCoin: z.boolean(),
  actualObject: z.string().optional(),
  coinType: z.string().optional(),
  country: z.string().optional(),
  countryFlag: z.string().optional(),
  denomination: z.string().optional(),
  year: z.union([z.string(), z.number()]).transform(val => String(val)).optional(),
  confidence: z.number().min(0).max(100).optional(),
  material: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  condition: z.string().optional(),
  rarity: z.string().optional(),
  estimatedValue: z.number().optional(),
  estimatedValueRange: z.string().optional(),
  valueFactors: z.array(z.string()).optional(),
});

export type CoinAnalysis = z.infer<typeof coinAnalysisSchema>;
