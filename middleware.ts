import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/employer-dashboard',
  '/wallet',
  '/settings'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/pricing',
  '/signup',
  '/login',
  '/upload-resume',
  '/jobs',
  '/network',
  '/posts'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Special handling for profile route - let client-side handle auth
  if (pathname === '/profile') {
    return NextResponse.next();
  }

  // Special handling for admin route - let client-side handle auth
  if (pathname === '/admin') {
    return NextResponse.next();
  }

  // Special handling for dashboard route - let it pass through
  if (pathname === '/dashboard') {
    return NextResponse.next();
  }

  // Special handling for post-job route - let it pass through
  if (pathname === '/post-job') {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('accessToken')?.value;
  
  // If it's a protected route and no token, redirect to home with auth modal
  if (isProtectedRoute && !token) {
    const homeUrl = new URL('/', request.url);
    homeUrl.searchParams.set('auth', 'login');
    homeUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(homeUrl);
  }

  // If user is authenticated and trying to access login/signup, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is authenticated and accessing home page with auth=login, redirect to dashboard
  if (token && pathname === '/' && request.nextUrl.searchParams.get('auth') === 'login') {
    const redirect = request.nextUrl.searchParams.get('redirect');
    if (redirect) {
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 