"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Clipboard,
  ClipboardCheck,
  Download,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import "react-quill/dist/quill.snow.css";
import {
  CONTENT_TEMPLATES,
  TEMPLATE_LOOKUP,
  TONE_OPTIONS,
  WORD_COUNT_PRESETS,
  type ContentTemplate,
} from "@/lib/constants";
import { patchReactQuill } from "@/lib/react-quill-loader";
import type { ReactQuillProps } from "react-quill";
import type { ContentCategory, GenerationPayload } from "@/types/content";

const ReactQuill = dynamic<ReactQuillProps>(async () => {
  const mod = await import("react-quill");
  const component = patchReactQuill(mod);
  return { default: component };
}, {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  ),
});

function formatKeywords(value: string[]) {
  return value.join(", ");
}

function parseKeywords(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function GenerationStudio() {
  const searchParams = useSearchParams();
  const selectedFromUrl = searchParams.get("template") as ContentCategory | null;
  const defaultTemplate = selectedFromUrl ?? "blog";

  const [template, setTemplate] = useState<ContentCategory>(defaultTemplate);
  const [prompt, setPrompt] = useState(
    TEMPLATE_LOOKUP[defaultTemplate]?.samplePrompt ?? "",
  );
  const [tone, setTone] = useState<(typeof TONE_OPTIONS)[number]>("Professional");
  const [wordCount, setWordCount] = useState<number>(600);
  const [keywords, setKeywords] = useState<string>(
    formatKeywords(TEMPLATE_LOOKUP[defaultTemplate]?.recommendedKeywords ?? []),
  );

  const [output, setOutput] = useState<string>("");
  const [tokenUsage, setTokenUsage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastPayload, setLastPayload] = useState<GenerationPayload | null>(null);

  const activeTemplate: ContentTemplate = useMemo(
    () => TEMPLATE_LOOKUP[template],
    [template],
  );
  const readOnlyModules = useMemo(() => ({ toolbar: false }), []);

  const submit = useCallback(
    async (payload: GenerationPayload) => {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/generate", payload);
        const { content, tokenUsage: tokens } = response.data;
        setOutput(content);
        setTokenUsage(tokens);
        setLastPayload(payload);
        toast.success("Generation complete");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("generation:created"));
        }
      } catch (error: unknown) {
        console.error(error);
        const message =
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : "We could not generate content right now. Please try again.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please add a prompt so the AI knows what to write.");
      return;
    }

    const keywordList = parseKeywords(keywords);

    const payload: GenerationPayload = {
      prompt,
      tone,
      wordCount,
      keywords: keywordList,
      template,
    };

    void submit(payload);
  };

  const handleRegenerate = () => {
    if (!lastPayload) {
      toast("Generate something first to use regenerate.", {
        icon: "*",
      });
      return;
    }
    void submit(lastPayload);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    if (!output) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([output], { type: "text/plain" }));
    link.download = `${template}-content.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadAsPdf = () => {
    if (!output) return;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(output, 180);
    doc.text(lines, 15, 20);
    doc.save(`${template}-content.pdf`);
  };

  const handleTemplateChange = (value: ContentCategory) => {
    setTemplate(value);
    const templateConfig = TEMPLATE_LOOKUP[value];
    setPrompt(templateConfig.samplePrompt);
    setKeywords(formatKeywords(templateConfig.recommendedKeywords));
    const [min, max] = templateConfig.wordCountRange;
    setWordCount(Math.round((min + max) / 2));
  };

  useEffect(() => {
    if (selectedFromUrl && selectedFromUrl !== template) {
      handleTemplateChange(selectedFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFromUrl]);

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <form className="card-body space-y-6" onSubmit={handleSubmit}>
          <header className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Wand2 className="h-5 w-5" />
              <p className="font-semibold uppercase tracking-wide text-xs">
                Prompt Studio
              </p>
            </div>
            <h2 className="text-2xl font-semibold">Describe what you need</h2>
            <p className="text-sm text-base-content/70">
              Provide the high-level context and we will craft tailored copy
              based on your voice, tone, and keywords.
            </p>
          </header>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Template</span>
            </label>
            <select
              className="select select-bordered"
              value={template}
              onChange={(event) =>
                handleTemplateChange(event.target.value as ContentCategory)
              }
            >
              {CONTENT_TEMPLATES.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="mt-2 text-xs text-base-content/60">
              {activeTemplate.description}
            </span>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Prompt</span>
              <span className="label-text-alt text-xs text-base-content/60">
                Tip: highlight audience, offer, and goal
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered min-h-32 space-y-2"
              placeholder="Explain the content you would like the AI to generate."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tone</span>
              </label>
              <select
                className="select select-bordered"
                value={tone}
                onChange={(event) =>
                  setTone(event.target.value as (typeof TONE_OPTIONS)[number])
                }
              >
                {TONE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Word count</span>
                <span className="label-text-alt text-xs text-base-content/60">
                  Target length
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                min={50}
                max={2000}
                step={50}
                value={wordCount}
                onChange={(event) => setWordCount(Number(event.target.value))}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {WORD_COUNT_PRESETS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setWordCount(size)}
                    className="badge badge-outline cursor-pointer"
                  >
                    {size} words
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Keywords</span>
              <span className="label-text-alt text-xs text-base-content/60">
                Separate with commas
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate content
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={handleRegenerate}
            disabled={isLoading || !lastPayload}
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-semibold">Generated content</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleCopy}
              disabled={!output}
            >
              {copied ? (
                <>
                  <ClipboardCheck className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className="btn btn-outline"
                onClick={downloadAsText}
                disabled={!output}
              >
                <Download className="h-4 w-4" />
                .txt
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={downloadAsPdf}
                disabled={!output}
              >
                <Download className="h-4 w-4" />
                .pdf
              </button>
            </div>
          </div>
        </div>
        <ReactQuill
          theme="snow"
          readOnly
          modules={readOnlyModules}
          value={output}
          className="h-[420px]"
        />
        <footer className="flex flex-wrap items-center justify-between border border-dashed border-base-300 bg-base-100 p-3 text-sm text-base-content/70">
          <span>
            Template: <strong>{activeTemplate.label}</strong>
          </span>
          <span>
            Tone: <strong>{tone}</strong>
          </span>
          <span>
            Target words: <strong>{wordCount}</strong>
          </span>
          <span>
            Tokens:{" "}
            <strong>{tokenUsage !== null ? tokenUsage : "awaiting run"}</strong>
          </span>
        </footer>
      </section>
    </div>
  );
}
