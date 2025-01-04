'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'

interface FormCustomField {
  id: string
  name: string
  type: 'text' | 'number'
  value: string | number
}

interface FormData {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  addresses: {
    street: string
    city: string
    state: string
    zipCode: string
  }[]
  customFields: FormCustomField[]
}

interface PatientFormProps {
  onSubmit: (data: FormData) => void
  initialData?: FormData
}

export function PatientForm({ onSubmit, initialData }: PatientFormProps) {
  const [customFields, setCustomFields] = useState<FormCustomField[]>(
    initialData?.customFields?.map((field) => ({
      ...field,
      id: crypto.randomUUID()
    })) || []
  )

  const addCustomField = () => {
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

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id))
  }

  const handleCustomFieldChange = (
    id: string,
    field: keyof Omit<FormCustomField, 'id'>,
    value: string | number
  ) => {
    const updatedFields = [...customFields]
    const index = updatedFields.findIndex((f) => f.id === id)
    if (index === -1) return

    if (field === 'type') {
      updatedFields[index] = {
        ...updatedFields[index],
        type: value as 'text' | 'number',
        value: value === 'text' ? '' : 0
      }
    } else {
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: value
      }
    }
    setCustomFields(updatedFields)
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      middleName: initialData?.middleName || '',
      lastName: initialData?.lastName || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      addresses: initialData?.addresses || [
        { street: '', city: '', state: '', zipCode: '' }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'addresses'
  })

  const onFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      customFields
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Addresses</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ street: '', city: '', state: '', zipCode: '' })
              }
            >
              Add Address
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Address {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`addresses.${index}.street`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`addresses.${index}.zipCode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Custom Fields</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomField}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Field
            </Button>
          </div>
          {customFields.map((field) => (
            <div key={field.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Custom Field {field.name}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomField(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={field.name}
                    onChange={(e) =>
                      handleCustomFieldChange(field.id, 'name', e.target.value)
                    }
                  />
                </div>
                <div>
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={field.type}
                    onValueChange={(value) =>
                      handleCustomFieldChange(
                        field.id,
                        'type',
                        value as 'text' | 'number'
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FormLabel>Value</FormLabel>
                  {field.type === 'text' ? (
                    <Input
                      value={field.value}
                      onChange={(e) =>
                        handleCustomFieldChange(
                          field.id,
                          'value',
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        handleCustomFieldChange(
                          field.id,
                          'value',
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button type="submit">Save Patient</Button>
      </form>
    </Form>
  )
}
