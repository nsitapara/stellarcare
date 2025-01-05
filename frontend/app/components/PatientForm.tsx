'use client'

import {
  assignCustomFieldToUser,
  createCustomField,
  getCustomFields,
  getUserCustomFields
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
  const [customFields, setCustomFields] = useState<FormCustomField[]>([])
  const [availableCustomFields, setAvailableCustomFields] = useState<
    CustomFieldDefinition[]
  >([])
  const [userAssignedFields, setUserAssignedFields] = useState<
    CustomFieldDefinition[]
  >([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        console.log('Fetching custom fields...')
        console.log('Initial data:', initialData)

        // Get all available fields for search
        const allFields = await getCustomFields()
        console.log('All available fields:', allFields)
        setAvailableCustomFields(allFields)

        // Get user's assigned fields
        const assignedFields = await getUserCustomFields()
        console.log('User assigned fields:', assignedFields)
        console.log(
          'Assigned fields IDs:',
          assignedFields.map((f) => f.id)
        )
        setUserAssignedFields(assignedFields)

        if (initialData?.customFields) {
          // If we have initial data, use those custom fields
          console.log(
            'Loading initial custom fields:',
            initialData.customFields
          )
          const initialCustomFields: FormCustomField[] = []

          for (const field of initialData.customFields) {
            const fieldDef = allFields.find(
              (def) => def.id === field.customFieldDefinitionId
            )
            if (!fieldDef) {
              console.warn(
                `Could not find field definition for ID: ${field.customFieldDefinitionId}`
              )
              continue
            }
            const initialField: FormCustomField = {
              id: crypto.randomUUID(),
              name: fieldDef.name,
              type: fieldDef.type,
              value: field.value,
              customFieldDefinitionId: field.customFieldDefinitionId
            }
            console.log('Created initial field:', initialField)
            initialCustomFields.push(initialField)
          }

          console.log('Formatted initial custom fields:', initialCustomFields)
          setCustomFields(initialCustomFields)
        } else {
          // If no initial data, populate with user's assigned fields
          console.log('No initial data, using assigned fields')
          const defaultFields = assignedFields.map((field) => {
            console.log('Creating field from:', field)
            console.log('Field ID:', field.id)
            return {
              id: crypto.randomUUID(),
              name: field.name,
              type: field.type,
              value: field.type === 'text' ? '' : 0,
              customFieldDefinitionId: field.id
            }
          })
          console.log('Created default fields:', defaultFields)
          setCustomFields(defaultFields)
        }
      } catch (error) {
        console.error('Error fetching custom fields:', error)
        setAvailableCustomFields([])
        setUserAssignedFields([])
      }
    }
    fetchCustomFields()
  }, [initialData])

  const addCustomField = async (selectedField?: CustomFieldDefinition) => {
    console.log('Adding custom field:', selectedField)
    if (selectedField) {
      // Check if field is already added
      if (
        customFields.some((f) => f.customFieldDefinitionId === selectedField.id)
      ) {
        console.log('Field already exists in form')
        return
      }

      // Check if field is not in user's assigned fields
      if (!userAssignedFields.some((f) => f.id === selectedField.id)) {
        console.log('Assigning field to user:', selectedField.id)
        try {
          await assignCustomFieldToUser(selectedField.id)
          // Update user assigned fields
          setUserAssignedFields((prev) => {
            const updated = [selectedField, ...prev]
            console.log('Updated user assigned fields:', updated)
            return updated
          })
        } catch (error) {
          console.error('Error assigning field to user:', error)
        }
      }

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
      setCustomFields([newField, ...customFields])
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

          // Update available fields
          setAvailableCustomFields((prev) => {
            const updated = [newField, ...prev]
            console.log('Updated available custom fields:', updated)
            return updated
          })

          // Update user assigned fields
          setUserAssignedFields((prev) => {
            const updated = [newField, ...prev]
            console.log('Updated user assigned fields:', updated)
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
          setCustomFields([formField, ...customFields])
          setSearchQuery('')
          setIsSearchOpen(false)
        }
      } catch (error) {
        console.error('Error creating custom field:', error)
      }
    }
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id))
  }

  const handleCustomFieldChange = (
    id: string,
    field: keyof Omit<FormCustomField, 'id'>,
    value: string | number
  ) => {
    console.log('Handling custom field change:')
    console.log('Field ID:', id)
    console.log('Field key:', field)
    console.log('New value:', value)

    const updatedFields = [...customFields]
    const index = updatedFields.findIndex((f) => f.id === id)
    if (index === -1) return

    console.log('Current field:', updatedFields[index])
    console.log(
      'Current customFieldDefinitionId:',
      updatedFields[index].customFieldDefinitionId
    )

    if (field === 'type') {
      updatedFields[index] = {
        ...updatedFields[index],
        type: value as 'text' | 'number',
        value: value === 'text' ? '' : 0,
        customFieldDefinitionId: updatedFields[index].customFieldDefinitionId
      }
    } else {
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: value,
        customFieldDefinitionId: updatedFields[index].customFieldDefinitionId
      }
    }

    console.log('Updated field:', updatedFields[index])
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
    console.log('Raw custom fields before formatting:', customFields)

    const formData: FormData = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      addresses: data.addresses,
      customFields: customFields
    }

    console.log('Final form data:', formData)
    onSubmit(formData)
  }

  const filteredCustomFields = (availableCustomFields || []).filter(
    (field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !customFields.some((f) => f.customFieldDefinitionId === field.id)
  )
  console.log('Filtered custom fields:', filteredCustomFields)
  console.log('Current custom fields:', customFields)
  console.log('Available custom fields:', availableCustomFields)
  console.log('User assigned fields:', userAssignedFields)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="form-base">
        <div className="form-section">
          <div className="form-grid-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-input" />
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
                    <Input {...field} className="form-input" />
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
                    <Input {...field} className="form-input" />
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
                  <Input type="date" {...field} className="form-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3 className="form-section-title">Addresses</h3>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() =>
                append({ street: '', city: '', state: '', zipCode: '' })
              }
              className="form-button"
            >
              <Plus className="form-button-icon" />
              Add Address
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="form-card">
                <div className="form-card-header">
                  <h4 className="form-section-title">Address {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="delete-button"
                    >
                      <Trash2 className="form-button-icon" />
                    </Button>
                  )}
                </div>
                <div className="form-grid-2">
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.street`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input {...field} className="form-input" />
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
                          <Input {...field} className="form-input" />
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
                          <Input {...field} className="form-input" />
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
                          <Input {...field} className="form-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3 className="form-section-title">Additional Information</h3>
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="form-button"
                >
                  <Plus className="form-button-icon" />
                  Add Additional Information
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="right" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search Additional Fields"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <div className="flex flex-col items-center py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          No additional information found
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
          <div className="space-y-3">
            {customFields.map((field) => (
              <div key={field.id} className="form-card">
                <div className="form-card-header">
                  <h4 className="form-section-title">{field.name}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomField(field.id)}
                    className="delete-button"
                  >
                    <Trash2 className="form-button-icon" />
                  </Button>
                </div>
                <div className="form-grid-2">
                  {/* <div>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={field.name}
                      onChange={(e) =>
                        handleCustomFieldChange(
                          field.id,
                          'name',
                          e.target.value
                        )
                      }
                      className="form-input"
                    />
                  </div> */}

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
                        className="form-input"
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
                        className="form-input"
                      />
                    )}
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
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="px-6">
            Save Patient
          </Button>
        </div>
      </form>
    </Form>
  )
}
