import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind classes conditionally
 * @param {...(string|Object|Array)} inputs - Class names to combine
 * @returns {string} Combined class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}