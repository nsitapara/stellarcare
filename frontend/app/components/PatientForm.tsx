'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/app/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/components/ui/select'
import { Trash } from 'lucide-react'
import { useState } from 'react'

interface CustomFieldWithId {
  id: string
  name: string
  type: 'text' | 'number'
  value: string | number
}

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  addresses: z.array(
    z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z.string().min(1, 'ZIP code is required')
    })
  )
})

type FormData = z.infer<typeof formSchema>

interface PatientFormProps {
  onSubmit: (data: FormData & { customFields: CustomFieldWithId[] }) => void
  initialData?: FormData & { customFields?: CustomFieldWithId[] }
}

export function PatientForm({ onSubmit, initialData }: PatientFormProps) {
  const [customFields, setCustomFields] = useState<CustomFieldWithId[]>(
    initialData?.customFields?.map((field) => ({
      ...field,
      id: crypto.randomUUID()
    })) || []
  )

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      addresses: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'addresses'
  })

  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        id: crypto.randomUUID(),
        name: '',
        type: 'text',
        value: ''
      }
    ])
  }

  const handleSubmit = (data: FormData) => {
    onSubmit({ ...data, customFields })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="max-w-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Addresses</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ street: '', city: '', state: '', zipCode: '' })
              }
              className="bg-background hover:bg-primary hover:text-primary-foreground"
            >
              Add Address
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 gap-4 p-4 border rounded-lg"
            >
              <FormField
                control={form.control}
                name={`addresses.${index}.street`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input {...field} className="max-w-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`addresses.${index}.city`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} className="max-w-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`addresses.${index}.state`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} className="max-w-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name={`addresses.${index}.zipCode`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} className="max-w-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-9 w-9"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Custom Fields</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomField}
              className="bg-background hover:bg-primary hover:text-primary-foreground"
            >
              Add Custom Field
            </Button>
          </div>

          {customFields.map((field) => (
            <div
              key={field.id}
              className="grid grid-cols-3 gap-4 p-4 border rounded-lg items-end"
            >
              <div>
                <Label>Field Name</Label>
                <Input
                  placeholder="Field Name"
                  value={field.name}
                  onChange={(e) => {
                    const newFields = customFields.map((f) =>
                      f.id === field.id ? { ...f, name: e.target.value } : f
                    )
                    setCustomFields(newFields)
                  }}
                  className="max-w-sm"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value: 'text' | 'number') => {
                    const newFields = customFields.map((f) =>
                      f.id === field.id
                        ? {
                            ...f,
                            type: value,
                            value: value === 'number' ? 0 : ''
                          }
                        : f
                    )
                    setCustomFields(newFields)
                  }}
                >
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Value</Label>
                  <Input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => {
                      const newFields = customFields.map((f) =>
                        f.id === field.id
                          ? {
                              ...f,
                              value:
                                field.type === 'number'
                                  ? Number(e.target.value)
                                  : e.target.value
                            }
                          : f
                      )
                      setCustomFields(newFields)
                    }}
                    className="max-w-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setCustomFields(
                      customFields.filter((f) => f.id !== field.id)
                    )
                  }}
                  className="h-9 w-9"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  )
}
