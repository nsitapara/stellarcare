import { ApiError } from '@/types/api'
import { getApiClient } from '@lib/api'
import { authOptions } from '@lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    console.log('API Route - Fetching patients with params:', { page })

    const apiClient = await getApiClient(session)
    const response = await apiClient.patients.patientsList(
      page ? Number.parseInt(page) : 1
    )
    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to fetch patients:', error)
    if (error instanceof ApiError) {
      return NextResponse.json(error.body, { status: error.status })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Creating patient with data:', body)

    const apiClient = await getApiClient(session)
    const response = await apiClient.patients.patientsCreate({
      ...body,
      // Send empty arrays for required fields instead of undefined
      custom_fields: [],
      studies: [],
      treatments: [],
      insurance: [],
      appointments: []
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to create patient:', error)
    if (error instanceof ApiError) {
      console.error('API Error details:', {
        status: error.status,
        statusText: error.statusText,
        body: error.body,
        url: error.url
      })
      return NextResponse.json(error.body, { status: error.status })
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const { id, ...updateData } = data
    const api = await getApiClient(session)
    const response = await api.patients.patientsUpdate(id, updateData)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to update patient:', error)
    if (error instanceof ApiError) {
      console.error('API Error details:', {
        status: error.status,
        statusText: error.statusText,
        body: error.body,
        url: error.url
      })
      return NextResponse.json(error.body, { status: error.status })
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
