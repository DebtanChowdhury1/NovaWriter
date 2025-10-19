import { z } from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z
    .string()
    .min(1, "GEMINI_API_KEY is required to call Gemini APIs."),
  GEMINI_MODEL: z
    .string()
    .min(1)
    .default("gemini-2.0-flash"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required for persistence."),
});

export const env = envSchema.parse({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
  MONGODB_URI: process.env.MONGODB_URI,
});
