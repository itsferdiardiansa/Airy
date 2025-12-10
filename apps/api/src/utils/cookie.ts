import { Response, Request, CookieOptions } from 'express';

const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

export class CookieManager {
  static set(
    res: Response,
    name: string,
    value: string,
    options: Partial<CookieOptions> = {}
  ): void {
    res.cookie(name, value, {
      ...DEFAULT_COOKIE_OPTIONS,
      ...options,
    });
  }

  static clear(res: Response, name: string): void {
    res.cookie(name, '', {
      ...DEFAULT_COOKIE_OPTIONS,
      maxAge: 0,
    });
  }

  static get(req: Request, name: string): string | undefined {
    return req.cookies?.[name];
  }
}

export const setCookie = CookieManager.set;
export const clearCookie = CookieManager.clear;
export const getCookie = CookieManager.get;
