import { getPatient } from '@/app/actions/get-patient-action'
import { PatientTabs } from './patient-tabs'

export default async function PatientPage({
  params
}: { params: { id: string } }) {
  const patient = await getPatient(params.id)

  if (!patient) {
    return (
      <div className="container-wrapper py-8">
        <div className="form-card">
          <h1 className="dashboard-title">Patient not found</h1>
          <p className="dashboard-subtitle">
            The requested patient could not be found in the system.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-wrapper py-8">
      <div className="space-y-6">
        <PatientTabs patient={patient} />
      </div>
    </div>
  )
}
