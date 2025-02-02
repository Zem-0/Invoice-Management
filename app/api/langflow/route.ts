import { NextResponse } from 'next/server'

const LANGFLOW_API_KEY = "AstraCS:QkLzqDfIsxIINnxjUnXGBTkY:096e2df22e836b71c535e3ca702f56eacef7179527a74fefcf07d94f020fa6c0";
const BASE_URL = 'https://api.langflow.astra.datastax.com';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { endpoint, data } = body

    console.log('API Request:', { endpoint, data })

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LANGFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    console.log('API Response:', result)

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${JSON.stringify(result)}`)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
} 