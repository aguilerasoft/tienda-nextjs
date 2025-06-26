import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAuthenticated = !!req.nextauth.token;
  
    // Si el usuario no está autenticado y accede a la ruta raíz
    if (!isAuthenticated && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Si el usuario está autenticado y accede a la ruta raíz, redirigir al dashboard
    if (isAuthenticated && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/home', req.url));
    }

   
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = { matcher: ["/home/:path*","/producto/:path*"] }

