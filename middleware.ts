import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update session using Supabase utilities
  const response = await updateSession(request);
  
  // Basic route protection
  const path = request.nextUrl.pathname;
  
  // List of protected routes
  const isProtectedRoute = [
    '/dashboard',
    '/projects',
    '/tasks',
    '/calendar',
    '/activity',
    '/members',
    '/settings'
  ].some(route => path.startsWith(route));

  // Access the updated session cookies (since updateSession refreshed it if needed)
  // We can just rely on the session returned by updateSession. 
  // However, `updateSession` doesn't strictly redirect on its own.
  
  // Let's manually check if the cookie exists to prevent access to protected routes.
  const authCookie = request.cookies.get('sb-skzmgbqvgzinpozrvhpd-auth-token');
  
  if (isProtectedRoute && !authCookie) {
    return Response.redirect(new URL('/login', request.url));
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
