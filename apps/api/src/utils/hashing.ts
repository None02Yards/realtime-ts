import bcrypt from 'bcryptjs';

export async function hashPassword(raw: string) {
  return bcrypt.hash(raw, 10);
}

export async function comparePassword(raw: string, hashed: string) {
  return bcrypt.compare(raw, hashed);
}
