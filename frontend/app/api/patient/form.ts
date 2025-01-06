export interface FormCustomField {
  id: string
  name: string
  type: 'text' | 'number'
  value: string | number
  customFieldDefinitionId: number
  isNew?: boolean
  userEntered?: boolean
}
