import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'salonmitra_super_secret_jwt_key_2026';

export interface UserSession {
  userId: string;
  name: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'SALON_OWNER' | 'STAFF' | 'CUSTOMER';
  salonId?: string;
}

export function signToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (error) {
    return null;
  }
}
