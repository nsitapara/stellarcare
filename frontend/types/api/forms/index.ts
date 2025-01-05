import type { FieldValues, FormState, UseFormRegisterReturn } from 'react-hook-form'

/**
 * Props for form header component
 */
export interface FormHeaderProps {
  title: string
  description?: string
}

/**
 * Props for form footer component
 */
export interface FormFooterProps {
  cta: string
  link: string
  title: string
}

/**
 * Props for text field component
 */
export interface TextFieldProps {
  type: 'text' | 'password' | 'number'
  label: string
  placeholder?: string
  register: UseFormRegisterReturn
  formState: FormState<FieldValues>
}

/**
 * Props for submit field component
 */
export interface SubmitFieldProps {
  isLoading?: boolean
  children: React.ReactNode
}

/**
 * Props for message components
 */
export interface MessageProps {
  children: React.ReactNode
}
