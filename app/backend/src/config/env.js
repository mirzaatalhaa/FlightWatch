import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = ['PORT', 'DATABASE_URL', 'JWT_SECRET'];
const missingEnv = [];

for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    missingEnv.push(envVar);
  }
}

if (missingEnv.length > 0) {
  console.error('\n=========================================');
  console.error('CRITICAL ERROR: Environment Setup Failed');
  console.error('=========================================');
  console.error('Missing required environment variables:');
  missingEnv.forEach(envVar => {
    console.error(`  - ${envVar}`);
  });
  console.error('\nEnsure a valid .env file exists in the backend root directory.');
  console.error('=========================================\n');
  process.exit(1);
}

export const config = {
  port: parseInt(process.env.PORT, 10),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  isProd: process.env.NODE_ENV === 'production'
};
