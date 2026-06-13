import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const programSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  hostName: z.string().min(3),
  active: z.boolean().default(true),
  coverImageUrl: z.string().url().optional(),
});

export const scheduleSchema = z.object({
  programId: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isLive: z.boolean(),
  notes: z.string().max(500).optional(),
});

export const contentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum([
    "pregacao",
    "devocional",
    "louvor",
    "podcast",
    "programa_especial",
  ]),
  author: z.string().min(3),
  audioUrl: z.string().url(),
  imageUrl: z.string().url().optional(),
  durationSeconds: z.number().int().positive(),
  publishedAt: z.string().datetime().optional(),
  status: z.enum(["draft", "published", "archived"]),
  categoryIds: z.array(z.string().min(1)).min(1),
  programId: z.string().optional(),
  tags: z.array(z.string().min(1)).default([]),
});

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  bannerImageUrl: z.string().url().optional(),
  externalUrl: z.string().url().optional(),
  published: z.boolean().default(true),
});

export const bannerSchema = z.object({
  title: z.string().min(3),
  imageUrl: z.string().url(),
  linkUrl: z.string().url().optional(),
  active: z.boolean().default(true),
  priority: z.number().int().min(0).default(0),
});

export const contactSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8).optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export const prayerRequestSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  request: z.string().min(10),
  privateRequest: z.boolean().default(false),
});

export const messageStatusSchema = z.object({
  status: z.enum(["new", "in_progress", "answered", "closed"]),
  classification: z.string().max(100).optional(),
});

export const prayerStatusSchema = z.object({
  status: z.enum(["new", "in_progress", "answered", "closed"]),
  assignedTo: z.string().optional(),
});