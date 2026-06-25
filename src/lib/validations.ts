import { z } from "zod";

export const createEssaySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(1000, "Title must be under 1000 characters")
    .transform((s) => s.trim()),
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Essay must be under 5000 characters")
    .transform((s) => s.trim()),
});

export type CreateEssayInput = z.infer<typeof createEssaySchema>;

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export const MIN_WORD_COUNT = 150;
export const MAX_WORD_COUNT = 200;

export const createContactSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(1000, "Subject must be under 1000 characters")
    .transform((s) => s.trim()),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message must be under 5000 characters")
    .transform((s) => s.trim()),
  email: z.email("Invalid email address").transform((s) => s.trim()),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
