import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const GEOBLOCKING_ENABLED = process.env.NEXT_PUBLIC_GEOBLOCKING === 'true'

// US, Panama, Cuba, Iran, North Korea, Russia, Syria
const BLOCKED_COUNTRIES = ['US', 'PA', 'CU', 'IR', 'KP', 'RU', 'SY']

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  // req.geo does not exist when running client locally
  if (req.geo === undefined) {
    return
  }

  if (!GEOBLOCKING_ENABLED) {
    return NextResponse.next()
  }

  const country = req.geo.country || 'NOT-US' // NOT-US is for localhost testing

  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next()
  }

  if (BLOCKED_COUNTRIES.includes(country)) {
    req.nextUrl.pathname = '/geoblock'
  } else {
    // req.nextUrl.pathname = `/`
  }

  return NextResponse.rewrite(req.nextUrl)
}
