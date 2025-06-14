// src/auth/interfaces/jwt-payload.interface.ts

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'client';
  sub?: string | number; // opcional si también lo tienes
  iat?: number;
  exp?: number;
}
