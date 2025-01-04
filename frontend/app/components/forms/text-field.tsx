'use client'

import type React from 'react'
import type {
  FieldValues,
  FormState,
  UseFormRegisterReturn
} from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

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
      <span className="mb-3 block font-medium leading-none text-white">
        {label}
      </span>

      <input
        type={type}
        placeholder={placeholder}
        className={twMerge(
          'block h-10 max-w-lg rounded bg-secondary px-4 font-medium text-white placeholder:text-gray-400 shadow-sm outline outline-1 outline-gray-600 focus:outline-primary focus:ring-4 focus:ring-primary/20',
          hasError && 'outline-red-700 focus:outline-red-600 focus:ring-red-300'
        )}
        {...register}
      />

      {hasError && (
        <div className="mt-2 text-red-600">
          {formState.errors[register.name]?.message?.toString()}
        </div>
      )}
    </label>
  )
}
