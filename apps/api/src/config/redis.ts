// import { Redis } from 'ioredis';
// import { env } from './env';

// export const pub = new Redis(env.redisUrl);
// export const sub = new Redis(env.redisUrl);

// // still keep a general-purpose redis client if you want
// export const redis = new Redis(env.redisUrl);

// // presence helpers can keep using `redis`:
// export const presence = {
//   async online(userId: string) {
//     await redis.sadd('presence:online', userId);
//   },
//   async offline(userId: string) {
//     await redis.srem('presence:online', userId);
//   },
//   async all() {
//     return redis.smembers('presence:online');
//   },
// };

// import { Redis } from 'ioredis';
// import { env } from './env';

// export const redis = new Redis(env.redisUrl);      // general purpose
// export const pub   = new Redis(env.redisUrl);      // for socket.io adapter (publisher)
// export const sub   = new Redis(env.redisUrl);      // for socket.io adapter (subscriber)

// export const presence = {
//   async online(userId: string) { await redis.sadd('presence:online', userId); },
//   async offline(userId: string) { await redis.srem('presence:online', userId); },
//   async all() { return redis.smembers('presence:online'); },
// };

// apps/api/src/config/redis.ts
// Dev-safe no-op Redis so the app doesn't error if Redis isn't running.

export const redis = null;

// presence helpers that won't crash without Redis
export const presence = {
  async online(_userId: string) {},
  async offline(_userId: string) {},
  async all() { return [] as string[]; },
};

// stubs kept for adapter imports (we'll disable adapter next)
export const pub = null;
export const sub = null;
