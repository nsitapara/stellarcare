import * as React from 'react'

import { cn } from '@components/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-gray-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-accent focus:ring-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:dark:bg-zinc-800 [&:-webkit-autofill]:[filter:none]',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
