import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images/*|icons/*|logo/*|api/auth/*).*)']
}

// قائمة الصفحات الموجودة في التطبيق
const validRoutes = [
  '/',
  '/account',
  '/account/overview',
  '/account/overview/cart',
  '/account/overview/wishlist',
  '/account/settings',
  '/account/support',
  '/cart',
  '/wishlist',
  '/auth/callback',
  '/auth/redirect',
  '/connect'
]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // تجاهل الملفات الثابتة والـ API
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/images/') || 
      pathname.startsWith('/icons/') || 
      pathname.startsWith('/logo/') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico' ||
      pathname === '/robots.txt') {
    return NextResponse.next()
  }
  
  // إذا كان المسار غير موجود في القائمة، إعادة توجيه للصفحة الرئيسية
  if (!validRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}
 
