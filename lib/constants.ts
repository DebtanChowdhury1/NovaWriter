import { ContentCategory } from "@/types/content";

export interface ContentTemplate {
  slug: ContentCategory;
  label: string;
  description: string;
  samplePrompt: string;
  recommendedKeywords: string[];
  wordCountRange: [number, number];
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    slug: "blog",
    label: "Blog Article",
    description:
      "Long-form storytelling with SEO-friendly structure and engaging introductions.",
    samplePrompt: "Write a blog introducing AI-assisted marketing workflows.",
    recommendedKeywords: ["AI marketing", "workflow automation", "SaaS"],
    wordCountRange: [600, 1200],
  },
  {
    slug: "ad",
    label: "Ad Copy",
    description:
      "High-converting social or search ads focused on benefits, urgency, and clear CTAs.",
    samplePrompt: "Create a Facebook ad for a new AI writing assistant.",
    recommendedKeywords: ["AI writer", "free trial", "boost productivity"],
    wordCountRange: [50, 150],
  },
  {
    slug: "email",
    label: "Email Sequence",
    description:
      "Personalized outreach or lifecycle emails with strong hooks and next steps.",
    samplePrompt: "Draft a nurture email for leads exploring AI content tools.",
    recommendedKeywords: ["demo", "personalized content", "ROI"],
    wordCountRange: [200, 400],
  },
  {
    slug: "product",
    label: "Product Description",
    description:
      "Persuasive product descriptions highlighting key features and benefits.",
    samplePrompt: "Describe a smart standing desk with built-in charging ports.",
    recommendedKeywords: ["ergonomic", "smart desk", "USB-C charging"],
    wordCountRange: [120, 260],
  },
];

export const TEMPLATE_LOOKUP: Record<ContentCategory, ContentTemplate> =
  CONTENT_TEMPLATES.reduce(
    (acc, template) => {
      acc[template.slug] = template;
      return acc;
    },
    {} as Record<ContentCategory, ContentTemplate>,
  );

export const TONE_OPTIONS = [
  "Professional",
  "Friendly",
  "Persuasive",
  "Playful",
  "Authoritative",
] as const;

export const WORD_COUNT_PRESETS = [150, 300, 600, 900, 1200] as const;
