"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./sidebar";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost btn-sm md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="flex w-64 flex-col bg-base-100 shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-base-300 p-4">
              <span className="text-base font-semibold">NovaWriter</span>
              <button
                type="button"
                className="btn btn-circle btn-ghost btn-xs"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-3">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" &&
                    pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-content shadow-md"
                        : "hover:bg-base-200",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            type="button"
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close navigation overlay"
          />
        </div>
      ) : null}
    </>
  );
}
