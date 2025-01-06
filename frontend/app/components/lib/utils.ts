/**
 * Utility Functions
 *
 * This module provides utility functions for common operations across the application.
 * Currently includes class name merging functionality.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines and merges CSS class names using clsx and tailwind-merge.
 * This ensures proper handling of Tailwind CSS classes and their variants.
 *
 * @param inputs - Array of class values or conditional class expressions
 * @returns Optimized and merged class string
 *
 * @example
 * cn('text-red-500', isLarge && 'text-lg', ['px-4', 'py-2'])
 * // Returns merged and optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
