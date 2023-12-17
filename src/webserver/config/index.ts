import dotenv from 'dotenv';
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3030,
    corsAccessList: process.env.CORS_ACCESS_LIST?.split(',') || [
      'http://localhost:3000',
    ],
    prefix: process.env.API_PREFIX || '/api/v1',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
  },
};

export default config;
