import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/lib/env";
import type { GenerationPayload } from "@/types/content";
import { CONTENT_TEMPLATES } from "@/lib/constants";

const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const TEMPERATURE = 0.85;
const MAX_OUTPUT_TOKENS = 2048;

function buildPrompt({
  prompt,
  tone,
  wordCount,
  keywords,
  template,
}: GenerationPayload) {
  const templateMeta = CONTENT_TEMPLATES.find((item) => item.slug === template);

  return `
You are NovaWriter, an elite marketing copywriter who writes with clarity, persuasion, and authenticity.

Write a ${templateMeta?.label ?? template} in a ${tone} tone.
- Target word count: ${wordCount} words.
- Keywords to weave naturally: ${keywords.join(", ")}.
- Prompt / context: ${prompt}.

Structure the output with clear headings, short paragraphs, and bullet lists when useful.

Return only the final copy as plain text without any HTML or Markdown tags. Do not add commentary or explanations.`;
}

export async function generateWithGemini(payload: GenerationPayload) {
  const model = client.getGenerativeModel({
    model: env.GEMINI_MODEL,
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: buildPrompt(payload),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  });

  const text = result.response.text();
  const tokens =
    result.response.usageMetadata?.totalTokenCount ??
    result.response.usageMetadata?.candidatesTokenCount ??
    0;

  return {
    text,
    tokenUsage: tokens,
  };
}
