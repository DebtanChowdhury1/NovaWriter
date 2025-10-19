"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "./mobile-nav";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link
            href="/dashboard"
            className="text-base font-semibold md:hidden"
          >
            NovaWriter
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton appearance={{ elements: { userButtonAvatarBox: "size-9" } }} />
        </div>
      </div>
    </header>
  );
}
