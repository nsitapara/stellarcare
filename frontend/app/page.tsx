'use client'

import type { Patient } from '@/types/patient'
import { AppointmentCalendar } from '@components/AppointmentCalendar'
import { InsuranceInfo } from '@components/InsuranceInfo'
import { MedicationTracker } from '@components/MedicationTracker'
import { PatientForm } from '@components/PatientForm'
import { PatientTable } from '@components/PatientTable'
import { SleepAssessment } from '@components/SleepAssessment'
import { Button } from '@components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { useState } from 'react'

interface SleepStudy {
  id: string
  date: string
  results: string
  recommendations: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
}

interface CPAPUsage {
  id: string
  date: string
  hoursUsed: number
  events: number
}

interface Insurance {
  id: string
  provider: string
  policyNumber: string
  groupNumber: string
  startDate: string
}

interface Appointment {
  id: string
  date: string
  time: string
  type: string
  provider: string
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleSavePatient = (patient: Patient) => {
    if (selectedPatient) {
      setPatients(patients.map((p) => (p.id === patient.id ? patient : p)))
    } else {
      setPatients([...patients, patient])
    }
    setSelectedPatient(null)
    setIsFormVisible(false)
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsFormVisible(true)
  }

  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter((p) => p.id !== patientId))
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient(null)
    }
  }

  const handleAddSleepStudy = (study: SleepStudy) => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        sleepStudies: [...selectedPatient.sleepStudies, study]
      }
      setSelectedPatient(updatedPatient)
      setPatients(
        patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      )
    }
  }

  const handleAddMedication = (medication: Medication) => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        medications: [...selectedPatient.medications, medication]
      }
      setSelectedPatient(updatedPatient)
      setPatients(
        patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      )
    }
  }

  const handleAddCPAPUsage = (usage: CPAPUsage) => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        cpapUsage: [...selectedPatient.cpapUsage, usage]
      }
      setSelectedPatient(updatedPatient)
      setPatients(
        patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      )
    }
  }

  const handleAddInsurance = (insurance: Insurance) => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        insurance: [...selectedPatient.insurance, insurance]
      }
      setSelectedPatient(updatedPatient)
      setPatients(
        patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      )
    }
  }

  const handleAddAppointment = (appointment: Appointment) => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        appointments: [...selectedPatient.appointments, appointment]
      }
      setSelectedPatient(updatedPatient)
      setPatients(
        patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary/95">
      <div className="container mx-auto p-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Patient Management Dashboard
          </h1>
          <p className="text-white/80 text-xl">
            Efficiently manage and track your patient data
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          {isFormVisible ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-secondary">
                  {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFormVisible(false)
                    setSelectedPatient(null)
                  }}
                >
                  Back to List
                </Button>
              </div>
              <PatientForm
                initialData={selectedPatient || undefined}
                onSubmit={handleSavePatient}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-secondary">
                  Patient Records
                </h2>
                <Button
                  onClick={() => {
                    setIsFormVisible(true)
                    setSelectedPatient(null)
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add New Patient
                </Button>
              </div>

              {selectedPatient ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-secondary">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPatient(null)}
                    >
                      Back to Patient List
                    </Button>
                  </div>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                  >
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="sleep">Sleep Assessment</TabsTrigger>
                      <TabsTrigger value="medication">Medication</TabsTrigger>
                      <TabsTrigger value="insurance">Insurance</TabsTrigger>
                      <TabsTrigger value="appointments">
                        Appointments
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">
                          Patient Details
                        </h4>
                        <dl className="grid grid-cols-2 gap-4">
                          <div>
                            <dt className="font-medium">Date of Birth</dt>
                            <dd>{selectedPatient.dateOfBirth}</dd>
                          </div>
                          <div>
                            <dt className="font-medium">Status</dt>
                            <dd>{selectedPatient.status}</dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="font-medium">Addresses</dt>
                            {selectedPatient.addresses.map((address) => (
                              <dd
                                key={`${address.street}-${address.zipCode}`}
                                className="mt-1"
                              >
                                {address.street}, {address.city},{' '}
                                {address.state} {address.zipCode}
                              </dd>
                            ))}
                          </div>
                        </dl>
                        <Button
                          onClick={() => handleEditPatient(selectedPatient)}
                        >
                          Edit Patient
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="sleep">
                      <SleepAssessment
                        studies={selectedPatient.sleepStudies}
                        onAddStudy={handleAddSleepStudy}
                      />
                    </TabsContent>

                    <TabsContent value="medication">
                      <MedicationTracker
                        medications={selectedPatient.medications}
                        cpapUsage={selectedPatient.cpapUsage}
                        onAddMedication={handleAddMedication}
                        onAddCPAPUsage={handleAddCPAPUsage}
                      />
                    </TabsContent>

                    <TabsContent value="insurance">
                      <InsuranceInfo
                        insurance={selectedPatient.insurance}
                        onAddInsurance={handleAddInsurance}
                      />
                    </TabsContent>

                    <TabsContent value="appointments">
                      <AppointmentCalendar
                        appointments={selectedPatient.appointments}
                        onAddAppointment={handleAddAppointment}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <PatientTable
                  patients={patients}
                  onEdit={handleEditPatient}
                  onDelete={handleDeletePatient}
                  onSelect={setSelectedPatient}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
