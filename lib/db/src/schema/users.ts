import { pgTable, text, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // 'employer' | 'housekeeper'
  county: text("county").notNull(),
  phone: text("phone").notNull(),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  accountStatus: text("account_status").notNull().default("active"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  salaryExpectation: integer("salary_expectation").notNull().default(0),
  skills: text("skills"), // comma-separated
  experience: text("experience"),
  languages: text("languages"),
  availability: text("availability"),
  paymentVerified: boolean("payment_verified").notNull().default(false),
  verificationStatus: text("verification_status").notNull().default("pending"),
  registeredAt: timestamp("registered_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  registeredAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
