import { NextResponse } from 'next/server';
import { createToken, verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = await createToken({ authenticated: true });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
