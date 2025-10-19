import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes conditionally with clsx semantics.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
