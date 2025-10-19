"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { formatDistanceToNow } from "date-fns";
import { Eye, Layers, Loader2, Trash2, X } from "lucide-react";
import type { GenerationHistoryItem } from "@/types/content";
import { patchReactQuill } from "@/lib/react-quill-loader";
import type { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic<ReactQuillProps>(async () => {
  const mod = await import("react-quill");
  const component = patchReactQuill(mod);
  return { default: component };
}, {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  ),
});

interface HistoryTableProps {
  items: GenerationHistoryItem[];
  onDelete?: (id: string) => Promise<void> | void;
}

export function HistoryTable({ items, onDelete }: HistoryTableProps) {
  const [selected, setSelected] = useState<GenerationHistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const readOnlyModules = useMemo(() => ({ toolbar: false }), []);

  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-base-300 bg-base-100 text-center">
        <Layers className="h-8 w-8 text-base-content/30" />
        <div>
          <p className="font-semibold">No generations yet</p>
          <p className="text-sm text-base-content/70">
            Your writing history will appear here after you create content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <table className="table">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-base-content/70">
              <th>Template</th>
              <th>Prompt</th>
              <th>Tone</th>
              <th>Word count</th>
              <th>Tokens</th>
              <th>Generated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-base-200/60">
                <td className="font-medium capitalize">{item.template}</td>
                <td className="max-w-xs truncate text-sm" title={item.prompt}>
                  {item.prompt}
                </td>
                <td className="text-sm">{item.tone}</td>
                <td className="text-sm">{item.wordCount}</td>
                <td className="text-sm">{item.tokenUsage}</td>
                <td className="text-sm">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelected(item)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur">
          <div className="card max-h-[90vh] w-full max-w-3xl overflow-hidden border border-base-300 bg-base-100 shadow-2xl">
            <div className="card-body space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-base-content/60">
                    {selected.template} template
                  </p>
                  <h2 className="text-2xl font-semibold">
                    {selected.prompt.slice(0, 120)}
                    {selected.prompt.length > 120 ? "..." : ""}
                  </h2>
                  <p className="text-sm text-base-content/60">
                    Generated{" "}
                    {formatDistanceToNow(new Date(selected.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-circle btn-ghost btn-sm"
                  onClick={() => setSelected(null)}
                  aria-label="Close history item"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-base-content/60">
                <span>
                  <strong className="font-semibold text-base-content">
                    Tone:
                  </strong>{" "}
                  {selected.tone}
                </span>
                <span>
                  <strong className="font-semibold text-base-content">
                    Word target:
                  </strong>{" "}
                  {selected.wordCount}
                </span>
                <span>
                  <strong className="font-semibold text-base-content">
                    Tokens:
                  </strong>{" "}
                  {selected.tokenUsage}
                </span>
                <span>
                  <strong className="font-semibold text-base-content">
                    Keywords:
                  </strong>{" "}
                  {selected.keywords.join(", ")}
                </span>
              </div>
              <ReactQuill
                readOnly
                theme="snow"
                modules={readOnlyModules}
                value={selected.content}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
                {onDelete ? (
                  <button
                    type="button"
                    className="btn btn-error"
                    disabled={isDeleting}
                    onClick={async () => {
                      if (!selected || !onDelete) {
                        return;
                      }
                      setIsDeleting(true);
                      try {
                        await onDelete(selected._id);
                        setSelected(null);
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Removing
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
