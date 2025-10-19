import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateWithGemini } from "@/lib/services/gemini";
import connectDb from "@/lib/db/mongoose";
import { GenerationModel } from "@/lib/models/generation";

const generationSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters."),
  tone: z
    .string()
    .min(2)
    .max(40),
  wordCount: z
    .number()
    .int()
    .min(50, "Word count must be at least 50.")
    .max(2000, "Word count cannot exceed 2000 words."),
  keywords: z.array(z.string()).max(20, "Maximum 20 keywords are allowed."),
  template: z.enum(["blog", "ad", "email", "product"]),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = generationSchema.safeParse(payload);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const data = parsed.data;
    data.keywords = data.keywords.map((keyword) => keyword.trim()).filter(Boolean);

    const limit = checkRateLimit({ key: `generate:${userId}` });
    if (!limit.success) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${limit.retryAfter}s before trying again.`,
        },
        {
          status: 429,
          headers: limit.retryAfter
            ? { "Retry-After": String(limit.retryAfter) }
            : undefined,
        },
      );
    }

    const { text, tokenUsage } = await generateWithGemini(data);
    const content = text?.trim();

    if (!content) {
      return NextResponse.json(
        {
          error:
            "The AI returned an empty response. Please adjust your prompt and try again.",
        },
        { status: 502 },
      );
    }

    await connectDb();

    const entry = await GenerationModel.create({
      userId,
      template: data.template,
      prompt: data.prompt,
      tone: data.tone,
      wordCount: data.wordCount,
      keywords: data.keywords,
      content,
      tokenUsage: tokenUsage > 0 ? tokenUsage : Math.ceil(content.length / 4),
    });

    return NextResponse.json({
      content,
      tokenUsage: entry.tokenUsage,
      savedId: entry._id.toString(),
    });
  } catch (error) {
    console.error("Generation error", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong while generating content. Please retry in a moment.",
      },
      { status: 500 },
    );
  }
}
