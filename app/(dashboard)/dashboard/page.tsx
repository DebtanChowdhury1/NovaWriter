import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { BarChart3, Gauge, PenLine, TimerReset } from "lucide-react";
import { GenerationStudio } from "@/components/dashboard/generation-studio";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/data/dashboard";
import { TEMPLATE_LOOKUP } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stats = await getDashboardStats(userId);
  const topTemplateLabel =
    stats.topTemplate ? TEMPLATE_LOOKUP[stats.topTemplate].label : "-";

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-base text-base-content/70">
              Generate on-brand copy for every channel, powered by Gemini.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total generations"
              value={stats.totalGenerations}
              helperText="Lifetime content created with NovaWriter."
              icon={PenLine}
            />
            <StatCard
              title="Tokens used"
              value={stats.tokensUsed.toLocaleString()}
              helperText="Track usage to stay within plan limits."
              icon={Gauge}
              accent="secondary"
            />
            <StatCard
              title="Last generated"
              value={
                stats.lastGeneratedAt
                  ? formatDistanceToNow(new Date(stats.lastGeneratedAt), {
                      addSuffix: true,
                    })
                  : "N/A"
              }
              helperText="Keep a consistent publishing cadence."
              icon={TimerReset}
              accent="accent"
            />
            <StatCard
              title="Top template"
              value={topTemplateLabel}
              helperText="Most-used format over the last 30 days."
              icon={BarChart3}
            />
          </div>
        </div>
      </section>

      <section>
        <GenerationStudio />
      </section>
    </div>
  );
}
