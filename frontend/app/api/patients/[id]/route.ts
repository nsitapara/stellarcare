import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const api = await getApiClient(session)
    const response = await api.patients.patientsRetrieve(params.id)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to fetch patient:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
