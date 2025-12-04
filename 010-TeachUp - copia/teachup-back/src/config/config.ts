import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  postgres: {
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT ?? '5432'),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    dbName: process.env.PG_DATABASE,
  },

  aws: {
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    presignExpiration: parseInt(process.env.AWS_PRESIGN_EXPIRATION ?? '3600'),
  },

  API: {
    key: process.env.API_KEY,
    keyProd: process.env.API_KEY_PROD,
  },

  environment: process.env.NODE_ENV || 'dev',
}));
