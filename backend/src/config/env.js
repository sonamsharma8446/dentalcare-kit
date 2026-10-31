// Reads settings from the environment (.env file locally, dashboard settings on Render).
import 'dotenv/config';

const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((name) => !process.env[name]);
if (missing.length > 0) {
  throw new Error(`Missing environment variable(s): ${missing.join(', ')}. See backend/.env.example`);
}

const nodeEnv = process.env.NODE_ENV || 'development';

if (process.env.JWT_SECRET.length < 32 && nodeEnv === 'production') {
  throw new Error('JWT_SECRET must be at least 32 characters in production.');
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  loginRateLimit: Number(process.env.LOGIN_RATE_LIMIT) || 10,
};
