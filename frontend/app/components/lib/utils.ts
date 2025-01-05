import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function that combines Tailwind CSS classes with clsx and tailwind-merge.
 * This ensures proper class merging and overrides while maintaining Tailwind's utility-first approach.
 *
 * @param inputs - Array of class values to be merged
 * @returns Merged and optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
