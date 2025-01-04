'use client'

import type { CustomField, Patient } from '@/types/patient'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters')
})

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string(),
  addresses: z.array(addressSchema)
})

type FormData = z.infer<typeof formSchema>

interface PatientFormProps {
  onSubmit: (patient: Patient) => void
  initialData?: Patient
}

interface CustomFieldWithId extends CustomField {
  id: string
}

export function PatientForm({ onSubmit, initialData }: PatientFormProps) {
  const [customFields, setCustomFields] = useState<CustomFieldWithId[]>(
    initialData?.customFields.map((field) => ({
      ...field,
      id: crypto.randomUUID()
    })) || []
  )

  const form = useForm<FormData>({
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
    name: 'addresses',
    control: form.control
  })

  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        id: crypto.randomUUID(),
        name: '',
        type: 'text' as const,
        value: ''
      }
    ])
  }

  const handleSubmit = (data: FormData) => {
    const newPatient: Patient = {
      id: initialData?.id || crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      dateOfBirth: data.dateOfBirth,
      addresses: data.addresses,
      customFields: customFields.map(({ id, ...field }) => field),
      status: initialData?.status || 'Inquiry',
      sleepStudies: initialData?.sleepStudies || [],
      medications: initialData?.medications || [],
      cpapUsage: initialData?.cpapUsage || [],
      insurance: initialData?.insurance || [],
      appointments: initialData?.appointments || []
    }
    onSubmit(newPatient)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                <Input {...field} type="date" />
              </FormControl>
            </FormItem>
          )}
        />

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            <h3 className="text-lg font-semibold">Address {index + 1}</h3>
            <FormField
              control={form.control}
              name={`addresses.${index}.street`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => remove(index)}
            >
              Remove Address
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({ street: '', city: '', state: '', zipCode: '' })
          }
        >
          Add Address
        </Button>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Custom Fields</h3>
          {customFields.map((field) => (
            <div key={field.id} className="flex space-x-2">
              <Input
                placeholder="Field Name"
                value={field.name}
                onChange={(e) => {
                  const newFields = customFields.map((f) =>
                    f.id === field.id ? { ...f, name: e.target.value } : f
                  )
                  setCustomFields(newFields)
                }}
              />
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
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
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
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  setCustomFields(customFields.filter((f) => f.id !== field.id))
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCustomField}
          >
            Add Custom Field
          </Button>
        </div>

        <Button type="submit">Save Patient</Button>
      </form>
    </Form>
  )
}
