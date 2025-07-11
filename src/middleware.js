import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/profile',
  '/admin',
  "/playlists"
];

const adminRoutes = ['/admin'];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const token =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  const userToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET_KEY });
  const isAdmin = userToken?.admin;

  // Block unauthenticated users from protected routes
  if (isProtected && !token) {
    const signInUrl = new URL('/', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth|sitemap|robots.txt).*)'
  ]
};
