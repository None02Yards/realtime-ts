export type Cursor = { createdAt: string; _id: string };

export function decodeCursor(cursor?: string | null): Cursor | null {
  if (!cursor) return null;
  const [createdAt, _id] = Buffer.from(cursor, 'base64').toString().split('|');
  return createdAt && _id ? { createdAt, _id } : null;
}

export function encodeCursor(createdAt: Date, id: string) {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64');
}
