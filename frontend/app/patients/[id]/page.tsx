import { getPatient } from '@/app/actions/get-patient-action'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card'
import { format, isValid, parse, parseISO } from 'date-fns'
import { PatientTabs } from './patient-tabs'

function formatDate(dateString: string) {
  if (!dateString) return 'No date'

  try {
    // Try parsing as YYYY-MM-DD first
    let date = parse(dateString, 'yyyy-MM-dd', new Date())
    if (!isValid(date)) {
      // If that fails, try parsing as ISO
      date = parseISO(dateString)
      if (!isValid(date)) return 'Invalid date'
    }
    return format(date, 'MMMM d, yyyy')
  } catch {
    return 'Invalid date'
  }
}

// This is a server component that will fetch the patient data
export default async function PatientPage({
  params
}: { params: { id: string } }) {
  const patient = await getPatient(params.id)

  if (!patient) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Patient not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6">
        {/* Basic Information */}
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-y-6">
              <div>
                <dt className="text-sm text-gray-400">Full Name</dt>
                <dd className="text-white">
                  {patient.first} {patient.middle} {patient.last}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Patient ID</dt>
                <dd className="text-white">{patient.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Date of Birth</dt>
                <dd className="text-white">
                  {formatDate(patient.date_of_birth)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Status</dt>
                <dd className="text-white">{patient.status}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Created</dt>
                <dd className="text-white">{formatDate(patient.created_at)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Last Updated</dt>
                <dd className="text-white">
                  {formatDate(patient.modified_at)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm text-gray-400">Address</dt>
                {patient.addresses?.map((address) => (
                  <dd
                    key={`${address.street}-${address.city}-${address.state}`}
                    className="text-white mt-1"
                  >
                    {address.street}, {address.city}, {address.state}{' '}
                    {address.zip_code}
                  </dd>
                ))}
              </div>
              {patient.custom_fields && patient.custom_fields.length > 0 && (
                <div className="col-span-2">
                  <dt className="text-sm text-gray-400 mb-2">
                    Clinical Information
                  </dt>
                  <div className="grid grid-cols-2 gap-4">
                    {patient.custom_fields.map((field) => (
                      <div key={`${field.name}-${field.value}`}>
                        <dt className="text-sm text-gray-400">{field.name}</dt>
                        <dd className="text-white">{field.value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Client component that handles interactive tabs */}
        <PatientTabs patient={patient} />
      </div>
    </div>
  )
}
