import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// US, Panama, Cuba, Iran, North Korea, Russia, Syria
const BLOCKED_COUNTRIES = ['US', 'PA', 'CU', 'IR', 'KP', 'RU', 'SY']

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  if (req.geo === undefined) {
    return
  }

  const country = req.geo.country || 'NOT-US' // NOT-US is for localhost testing

  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  )
    return NextResponse.next()

  if (BLOCKED_COUNTRIES.includes(country)) {
    req.nextUrl.pathname = '/geoblock'
  } else {
    // req.nextUrl.pathname = `/`
  }

  return NextResponse.rewrite(req.nextUrl)
}
