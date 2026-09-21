import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.ADMIN_JWT_SECRET || 'fallback-secret-for-development';
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;
  
  const isLoginPage = pathname === '/admin/login';
  
  if (isLoginPage) {
    if (adminToken) {
      try {
        await jwtVerify(adminToken, getJwtSecretKey());
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch (e) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(adminToken, getJwtSecretKey());
    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
