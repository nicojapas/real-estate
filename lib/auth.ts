import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function createToken(payload: { authenticated: boolean }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return false;
  }

  const payload = await verifyToken(token);
  return payload?.authenticated === true;
}

export function verifyPassword(password: string) {
  return password === ADMIN_PASSWORD;
}
