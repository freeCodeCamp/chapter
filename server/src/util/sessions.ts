import { Request } from 'express';

export function getBearerToken(req: Request): string | undefined {
  const auth = req.headers.authorization;
  if (!auth) return undefined;
  const [, token] = auth.split(' ');
  return token;
}
