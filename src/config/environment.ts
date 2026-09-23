import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readNonNegativeIntegerEnv(name: string): number {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    return 0;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

export const environment = {
  url: required('SBPOJECT_URL'),
  username: required('SBPOJECT_USERNAME'),
  password: required('SBPOJECT_PASSWORD'),
  headed: process.env.HEADED === 'true',
  slowMo: readNonNegativeIntegerEnv('SLOW_MO'),
  keepBrowserOpenMs: readNonNegativeIntegerEnv('KEEP_BROWSER_OPEN_MS')
};
