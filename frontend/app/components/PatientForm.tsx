'use client'

import {
  createCustomField,
  getCustomFields
} from '@/app/actions/get-custom-fields-action'
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
import type { CustomFieldDefinition } from '@/types/api/models/CustomFieldDefinition'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
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
  customFieldDefinitionId: number
}

interface ApiCustomField {
  custom_field_definition_id: number
  type: 'text' | 'number'
  value_text: string | null
  value_number: number | null
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
  customFields: ApiCustomField[]
}

interface PatientFormProps {
  onSubmit: (data: FormData) => void
  initialData?: FormData
}

export function PatientForm({ onSubmit, initialData }: PatientFormProps) {
  const [customFields, setCustomFields] = useState<FormCustomField[]>([])
  const [availableCustomFields, setAvailableCustomFields] = useState<
    CustomFieldDefinition[]
  >([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        console.log('Fetching custom fields...')
        const fields = await getCustomFields()
        console.log('Received custom fields:', fields)
        // Remove duplicate fields by name, keeping the most recent one
        const uniqueFields = fields.reduce((acc, curr) => {
          acc.set(curr.name, curr)
          return acc
        }, new Map<string, CustomFieldDefinition>())
        const dedupedFields = Array.from(uniqueFields.values())
        console.log('Deduped fields:', dedupedFields)
        setAvailableCustomFields(dedupedFields)

        // Initialize custom fields after we have the available fields
        if (initialData?.customFields) {
          const initialCustomFields = initialData.customFields.map((field) => {
            const fieldDef = dedupedFields.find(
              (def) => def.id === field.custom_field_definition_id
            )
            return {
              id: crypto.randomUUID(),
              name: fieldDef?.name || 'Unknown Field',
              type: field.type,
              value:
                field.type === 'text'
                  ? field.value_text || ''
                  : field.value_number || 0,
              customFieldDefinitionId: field.custom_field_definition_id
            }
          })
          setCustomFields(initialCustomFields)
        }
      } catch (error) {
        console.error('Error fetching custom fields:', error)
        setAvailableCustomFields([])
      }
    }
    fetchCustomFields()
  }, [initialData])

  const addCustomField = async (selectedField?: CustomFieldDefinition) => {
    console.log('Adding custom field:', selectedField)
    if (selectedField) {
      console.log(
        'Selected field ID:',
        selectedField.id,
        'Type:',
        typeof selectedField.id
      )
      const newField = {
        id: crypto.randomUUID(),
        name: selectedField.name,
        type: selectedField.type,
        value: selectedField.type === 'text' ? '' : 0,
        customFieldDefinitionId: selectedField.id
      }
      console.log('Adding existing field:', newField)
      setCustomFields([...customFields, newField])
    } else if (searchQuery) {
      try {
        console.log('Creating new custom field with name:', searchQuery)
        const newField = await createCustomField({
          name: searchQuery,
          type: 'text',
          description: 'Custom field created from patient form'
        })
        if (newField) {
          console.log('Successfully created new field:', newField)
          console.log('New field ID:', newField.id, 'Type:', typeof newField.id)
          setAvailableCustomFields((prev) => {
            const updated = [...prev, newField]
            console.log('Updated available custom fields:', updated)
            return updated
          })
          const formField = {
            id: crypto.randomUUID(),
            name: newField.name,
            type: newField.type,
            value: newField.type === 'text' ? '' : 0,
            customFieldDefinitionId: newField.id
          }
          console.log('Adding new field to form:', formField)
          setCustomFields([...customFields, formField])
        }
      } catch (error) {
        console.error('Error creating custom field:', error)
      }
    }
    setIsSearchOpen(false)
    setSearchQuery('')
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
    const formattedCustomFields: ApiCustomField[] = customFields.map(
      (field) => {
        console.log('Formatting custom field:', field)
        console.log(
          'Custom field definition ID:',
          field.customFieldDefinitionId,
          'Type:',
          typeof field.customFieldDefinitionId
        )
        return {
          custom_field_definition_id: field.customFieldDefinitionId,
          type: field.type,
          value_text: field.type === 'text' ? String(field.value) : null,
          value_number: field.type === 'number' ? Number(field.value) : null
        }
      }
    )

    console.log('Submitting form with custom fields:', formattedCustomFields)

    const formData: FormData = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      addresses: data.addresses,
      customFields: formattedCustomFields
    }

    onSubmit(formData)
  }

  const filteredCustomFields = (availableCustomFields || []).filter(
    (field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !customFields.some((f) => f.name === field.name)
  )
  console.log('Filtered custom fields:', filteredCustomFields)
  console.log('Current custom fields:', customFields)
  console.log('Available custom fields:', availableCustomFields)

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
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Field
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="right" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search custom fields..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <div className="flex flex-col items-center py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          No custom fields found
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addCustomField()}
                        >
                          Create &quot;{searchQuery}&quot;
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredCustomFields.map((field) => (
                        <CommandItem
                          key={field.id}
                          onSelect={() => addCustomField(field)}
                        >
                          <div className="flex items-center">
                            <span>{field.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({field.type})
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
