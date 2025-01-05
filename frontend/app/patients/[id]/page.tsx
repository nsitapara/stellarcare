import { getPatient } from '@/app/actions/get-patient-action'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { PatientTabs } from './patient-tabs'

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {patient.first_name} {patient.last_name}
        </h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date of Birth
                </dt>
                <dd>{patient.date_of_birth}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd>
                  {patient.addresses?.[0]?.street},{' '}
                  {patient.addresses?.[0]?.city},{' '}
                  {patient.addresses?.[0]?.state}{' '}
                  {patient.addresses?.[0]?.zip_code}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Client component that handles interactive tabs */}
        <PatientTabs patientId={params.id} />
      </div>
    </div>
  )
}
