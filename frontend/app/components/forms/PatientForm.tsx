/**
 * PatientForm Component
 *
 * A comprehensive form for patient data management that handles:
 * - Basic patient information (name, DOB)
 * - Multiple addresses
 * - Dynamic custom fields with different types
 * - Field validation
 * - Integration with custom fields API
 */

'use client'

import {
  assignCustomFieldToUser,
  createCustomField,
  getCustomFields,
  getUserCustomFields
} from '@actions/patient/get-custom-fields-action'
import type { CustomFieldDefinition } from '@api/models/CustomFieldDefinition'
import type { FormCustomField, PatientFormData } from '@api/patient/form'
import { Button } from '@components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@components/ui/form'
import { Input } from '@components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void
  initialData?: PatientFormData
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
        // Get all available fields for search
        const allFields = await getCustomFields()
        setAvailableCustomFields(allFields)

        // Get user's assigned fields
        const assignedFields = await getUserCustomFields()
        setUserAssignedFields(assignedFields)

        if (initialData?.customFields) {
          // If we have initial data, use those custom fields
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
            initialCustomFields.push(initialField)
          }

          setCustomFields(initialCustomFields)
        } else {
          // If no initial data, populate with user's assigned fields
          const defaultFields = assignedFields.map((field) => {
            return {
              id: crypto.randomUUID(),
              name: field.name,
              type: field.type,
              value: field.type === 'text' ? '' : 0,
              customFieldDefinitionId: field.id
            }
          })
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
    if (selectedField) {
      // Check if field is already added
      if (
        customFields.some((f) => f.customFieldDefinitionId === selectedField.id)
      ) {
        return
      }

      // Check if field is not in user's assigned fields
      if (!userAssignedFields.some((f) => f.id === selectedField.id)) {
        try {
          await assignCustomFieldToUser(selectedField.id)
          // Update user assigned fields
          setUserAssignedFields((prev) => {
            const updated = [selectedField, ...prev]
            return updated
          })
        } catch (error) {
          console.error('Error assigning field to user:', error)
        }
      }

      const newField = {
        id: crypto.randomUUID(),
        name: selectedField.name,
        type: selectedField.type,
        value: selectedField.type === 'text' ? '' : 0,
        customFieldDefinitionId: selectedField.id
      }
      setCustomFields([newField, ...customFields])
    } else if (searchQuery) {
      try {
        const newField = await createCustomField({
          name: searchQuery,
          type: 'text',
          description: 'Custom field created from patient form'
        })
        if (newField) {
          // Update available fields
          setAvailableCustomFields((prev) => {
            const updated = [newField, ...prev]
            return updated
          })

          // Update user assigned fields
          setUserAssignedFields((prev) => {
            const updated = [newField, ...prev]
            return updated
          })

          const formField = {
            id: crypto.randomUUID(),
            name: newField.name,
            type: newField.type,
            value: newField.type === 'text' ? '' : 0,
            customFieldDefinitionId: newField.id
          }
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
    const updatedFields = [...customFields]
    const index = updatedFields.findIndex((f) => f.id === id)
    if (index === -1) return

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
    const formData: PatientFormData = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      addresses: data.addresses,
      customFields: customFields.map((field) => ({
        id: field.id,
        name: field.name,
        type: field.type,
        value: field.value,
        customFieldDefinitionId: field.customFieldDefinitionId
      }))
    }

    onSubmit(formData)
  }

  const filteredCustomFields = (availableCustomFields || []).filter(
    (field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !customFields.some((f) => f.customFieldDefinitionId === field.id)
  )

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
              <FormItem className="max-w-[150px]">
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="date" {...field} className="form-input pr-8" />
                  </div>
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
