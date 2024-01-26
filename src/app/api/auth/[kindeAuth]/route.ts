import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: any
): Promise<void | NextResponse> {
  const endpoint = params.kindeAuth
  const result = await handleAuth(request, endpoint)

  // Handle the result and return a compatible type
  // For example, assuming handleAuth returns a NextResponse:
  return result;
}
