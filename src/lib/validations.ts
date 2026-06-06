import { z } from "zod";

export const createEssaySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters")
    .transform((s) => s.trim()),
  content: z
    .string()
    .min(50, "Essay must be at least 50 characters")
    .max(5000, "Essay content is too long")
    .transform((s) => s.trim()),
});

export type CreateEssayInput = z.infer<typeof createEssaySchema>;

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export const MAX_WORD_COUNT = 500;

export function validateWordCount(content: string): boolean {
  return countWords(content) <= MAX_WORD_COUNT;
}
