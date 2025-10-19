import Link from "next/link";
import { ArrowUpRight, BookmarkPlus, FileText } from "lucide-react";
import { CONTENT_TEMPLATES } from "@/lib/constants";

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="mt-2 max-w-2xl text-base text-base-content/70">
          Kickstart your next blog, ad, outreach email, or product description
          with expert-crafted templates that blend brand voice and conversion
          science.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {CONTENT_TEMPLATES.map((template) => (
          <article
            key={template.slug}
            className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="card-body space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 p-3 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">{template.label}</h2>
                  <p className="text-sm text-base-content/60">
                    {template.description}
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-base-200 p-4 text-sm text-base-content/70">
                <p className="font-medium text-base-content">Sample prompt</p>
                <p className="mt-1">{template.samplePrompt}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-base-content/60">
                  Recommended keywords
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {template.recommendedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="badge badge-outline badge-primary badge-lg"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-base-content/60">
                <span>
                  Ideal length: {template.wordCountRange[0]} -{" "}
                  {template.wordCountRange[1]} words
                </span>
                <BookmarkPlus className="h-4 w-4" />
              </div>
              <div className="card-actions">
                <Link
                  href={`/dashboard?template=${template.slug}`}
                  className="btn btn-primary btn-block"
                >
                  Start writing
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
