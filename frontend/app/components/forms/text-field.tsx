'use client'

import { cn } from '@components/lib/utils'
import type React from 'react'
import type {
  FieldValues,
  FormState,
  UseFormRegisterReturn
} from 'react-hook-form'

export function TextField({
  type,
  label,
  placeholder,
  register,
  formState
}: {
  type: 'text' | 'password' | 'number'
  label: string
  placeholder?: string
  register: UseFormRegisterReturn
  formState: FormState<FieldValues>
}): React.ReactElement {
  const hasError = formState.errors[register.name]

  return (
    <label className="mb-6 flex flex-col last:mb-0">
      <span className="mb-3 block font-medium text-foreground">{label}</span>

      <input
        type={type}
        placeholder={placeholder}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-secondary px-3 py-1 text-sm ring-offset-background text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
        {...register}
      />

      {hasError && (
        <div className="mt-2 text-destructive text-sm">
          {formState.errors[register.name]?.message?.toString()}
        </div>
      )}
    </label>
  )
}
