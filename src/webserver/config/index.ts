import dotenv from 'dotenv';
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3030,
    corsAccessList: process.env.CORS_ACCESS_LIST?.split(',') || ['http://localhost:3000'],
    prefix: process.env.API_PREFIX || '/api/v1',
    mail: {
      host: process.env.MAIL_HOST || '',
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASS || '',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
  },
  passwords: {
    interface: process.env.INTERFACE_PASSWORD || '1234',
  },
};

export default config;
