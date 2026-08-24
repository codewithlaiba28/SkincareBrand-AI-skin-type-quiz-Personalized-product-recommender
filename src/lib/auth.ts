import { jwtVerify, SignJWT } from 'jose';

interface SessionPayload {
  userId: number;
  email: string;
  name: string;
}

const secretKey = process.env.JWT_SECRET || 'super-secret-key-for-dev-only-change-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
