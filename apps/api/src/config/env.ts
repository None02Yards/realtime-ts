import 'dotenv/config';

function req(name: string, def?: string) {
  const v = process.env[name] ?? def;
  if (v === undefined) throw new Error(`Missing env ${name}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(req('PORT', '8080')),
  webOrigin: req('WEB_ORIGIN', 'http://localhost:4200'),

  mongoUri: req('MONGO_URI'),
  redisUrl: req('REDIS_URL'),

  jwt: {
    accessSecret: req('JWT_ACCESS_SECRET'),
    refreshSecret: req('JWT_REFRESH_SECRET'),
    accessExpires: req('JWT_ACCESS_EXPIRES', '15m'),
    refreshExpires: req('JWT_REFRESH_EXPIRES', '30d'),
  },

  uploadDir: req('UPLOAD_DIR', './uploads'),
};
