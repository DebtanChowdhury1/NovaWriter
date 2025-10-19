import { GenerationModel } from "@/lib/models/generation";
import connectDb from "@/lib/db/mongoose";
import type { GenerationHistoryItem } from "@/types/content";

export async function getUserHistory(userId: string) {
  await connectDb();

  const items = await GenerationModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return items.map((item): GenerationHistoryItem => ({
    _id: item._id.toString(),
    userId: item.userId,
    template: item.template,
    prompt: item.prompt,
    tone: item.tone,
    wordCount: item.wordCount,
    keywords: item.keywords,
    content: item.content,
    tokenUsage: item.tokenUsage,
    createdAt: item.createdAt.toISOString(),
  }));
}
