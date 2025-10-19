import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HistoryShell } from "@/components/history/history-shell";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="mt-2 text-base text-base-content/70">
          Every generation is saved with timestamps, tokens, and parameters so
          you can reuse winning content.
        </p>
      </header>
      <HistoryShell />
    </div>
  );
}
