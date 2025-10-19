import connectDb from "@/lib/db/mongoose";
import { GenerationModel } from "@/lib/models/generation";
import type { DashboardStats } from "@/types/content";

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  await connectDb();

  const [usageStats] = await GenerationModel.aggregate<{
    totalGenerations: number;
    tokensUsed: number;
    lastGeneratedAt: Date;
  }>([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalGenerations: { $sum: 1 },
        tokensUsed: { $sum: "$tokenUsage" },
        lastGeneratedAt: { $max: "$createdAt" },
      },
    },
  ]);

  const [popularTemplate] = await GenerationModel.aggregate<{
    _id: string;
    count: number;
  }>([
    {
      $match: {
        userId,
        createdAt: { $gte: new Date(Date.now() - THIRTY_DAYS_MS) },
      },
    },
    {
      $group: {
        _id: "$template",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  return {
    totalGenerations: usageStats?.totalGenerations ?? 0,
    tokensUsed: usageStats?.tokensUsed ?? 0,
    lastGeneratedAt: usageStats?.lastGeneratedAt?.toISOString(),
    topTemplate: popularTemplate?._id as DashboardStats["topTemplate"],
  };
}
