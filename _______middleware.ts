import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images/*|icons/*|logo/*|api/auth/*).*)']

}

 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
 
