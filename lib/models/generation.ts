import { Model, Schema, models, model } from "mongoose";
import type { ContentCategory } from "@/types/content";

export interface GenerationDocument {
  userId: string;
  template: ContentCategory;
  prompt: string;
  tone: string;
  wordCount: number;
  keywords: string[];
  content: string;
  tokenUsage: number;
  createdAt: Date;
  updatedAt: Date;
}

const generationSchema = new Schema<GenerationDocument>(
  {
    userId: { type: String, required: true, index: true },
    template: {
      type: String,
      required: true,
      enum: ["blog", "ad", "email", "product"],
    },
    prompt: { type: String, required: true },
    tone: { type: String, required: true },
    wordCount: { type: Number, required: true },
    keywords: { type: [String], default: [] },
    content: { type: String, required: true },
    tokenUsage: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const GenerationModel: Model<GenerationDocument> =
  models.Generation ?? model<GenerationDocument>("Generation", generationSchema);
