// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type JWTPayload = { sub: string };

/** Access token: short-lived */
export function signAccess(userId: string) {
  // env.jwt.accessSecret is a string; jsonwebtoken accepts strings as secrets.
  return jwt.sign({ sub: userId }, env.jwt.accessSecret, {
    // If TS complains about the union, force-cast the options.
    expiresIn: env.jwt.accessExpires as any,
  } as any);
}

/** Refresh token: long-lived */
export function signRefresh(userId: string) {
  return jwt.sign({ sub: userId }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires as any,
  } as any);
}

/** Verify access token and normalize payload */
export function verifyAccess(token: string): JWTPayload {
  const decoded = jwt.verify(token, env.jwt.accessSecret) as any;
  return { sub: String(decoded.sub) };
}

/** Verify refresh token and normalize payload */
export function verifyRefresh(token: string): JWTPayload {
  const decoded = jwt.verify(token, env.jwt.refreshSecret) as any;
  return { sub: String(decoded.sub) };
}
