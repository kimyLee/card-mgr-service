import { registerAs } from '@nestjs/config';

export default registerAs('accountConfig', () => ({
  superAccountName: process.env.SUPER_ACCOUNT_NAME,
  superAccountPass: process.env.SUPER_ACCOUNT_PASS,
}));
