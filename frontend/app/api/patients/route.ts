import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get('page') || '1')
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '10')

    const api = await getApiClient(session)
    const response = await api.patients.patientsList(page, pageSize)

    // Return the response directly - addresses are already included in the patient data
    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to fetch patients:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
