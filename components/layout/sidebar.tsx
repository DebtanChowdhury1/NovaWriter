"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  History,
  UserRoundCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/templates",
    label: "Templates",
    icon: Sparkles,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserRoundCog,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-64 flex-shrink-0 border-r border-base-300 bg-base-100 md:flex">
      <nav className="flex w-full flex-col gap-2 p-4">
        <div className="flex items-center gap-2 rounded-2xl bg-primary/10 p-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <p className="text-lg font-semibold tracking-tight">NovaWriter</p>
            <p className="text-sm text-base-content/70">
              AI Content Generator
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-1 flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-content shadow-md"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content",
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="rounded-xl border border-dashed border-base-300 p-4 text-xs text-base-content/60">
          <p className="font-medium text-base-content">Token usage</p>
          <p>Track consumption per generation and upgrade for higher limits.</p>
        </div>
      </nav>
    </aside>
  );
}
