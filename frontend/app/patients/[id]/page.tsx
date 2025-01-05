import { getPatient } from '@/app/actions/get-patient-action'
import { PatientTabs } from './patient-tabs'

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
        <PatientTabs patient={patient} />
      </div>
    </div>
  )
}
