import appConfig from '@/webserver/config';
import type { Request } from 'express';
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (req: Request, callback: any) => {
  const allowlist = appConfig.app.corsAccessList;
  callback(null, { origin: allowlist.includes(req.header('Origin') || '') });
};
