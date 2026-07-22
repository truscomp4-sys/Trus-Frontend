import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/verify-email',
  '/admin/reset-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const isPublic = PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))
  if (isPublic) {
    return NextResponse.next()
  }

  const token = request.cookies.get('adminToken')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
