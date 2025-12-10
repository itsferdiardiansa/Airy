import jwt, { SignOptions, Algorithm } from 'jsonwebtoken';
import { env } from '@/config/env';
import crypto from 'crypto';

export interface JwtPayload {
  sub: string;
  role: string;
  type: 'access' | 'refresh';
  jti?: string;
  fp?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export class TokenService {
  private static readonly ISSUER = 'airy-api';
  private static readonly AUDIENCE = 'airy-clients';

  private static readonly ALGORITHM: Algorithm = 'HS256';

  private static readonly ACCESS_OPTS: SignOptions = {
    expiresIn: '15m',
    algorithm: TokenService.ALGORITHM,
    issuer: TokenService.ISSUER,
    audience: TokenService.AUDIENCE,
  };

  private static readonly REFRESH_OPTS: SignOptions = {
    expiresIn: '7d',
    algorithm: TokenService.ALGORITHM,
    issuer: TokenService.ISSUER,
    audience: TokenService.AUDIENCE,
  };

  private static generateJti(): string {
    return crypto.randomUUID();
  }

  static signAccessToken(
    payload: Omit<JwtPayload, 'type' | 'jti' | 'iss' | 'aud'>
  ): string {
    const fullPayload: JwtPayload = {
      ...payload,
      type: 'access',
      jti: this.generateJti(),
    };

    const secretOrKey = env.JWT_ACCESS_SECRET;

    return jwt.sign(fullPayload, secretOrKey, this.ACCESS_OPTS);
  }

  static signRefreshToken(
    payload: Omit<JwtPayload, 'type' | 'jti' | 'iss' | 'aud'>
  ): string {
    const fullPayload: JwtPayload = {
      ...payload,
      type: 'refresh',
      jti: this.generateJti(),
    };

    const secretOrKey = env.JWT_REFRESH_SECRET;

    return jwt.sign(fullPayload, secretOrKey, this.REFRESH_OPTS);
  }

  static verifyAccessToken(token: string): JwtPayload {
    const secretOrKey = env.JWT_ACCESS_SECRET;

    return jwt.verify(token, secretOrKey, {
      algorithms: [this.ALGORITHM],
      issuer: this.ISSUER,
      audience: this.AUDIENCE,
    }) as JwtPayload;
  }

  static verifyRefreshToken(token: string): JwtPayload {
    const secretOrKey = env.JWT_REFRESH_SECRET;

    return jwt.verify(token, secretOrKey, {
      algorithms: [this.ALGORITHM],
      issuer: this.ISSUER,
      audience: this.AUDIENCE,
    }) as JwtPayload;
  }

  static decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload;
  }
}

export const signAccessToken = TokenService.signAccessToken.bind(TokenService);
export const signRefreshToken =
  TokenService.signRefreshToken.bind(TokenService);
export const verifyAccessToken =
  TokenService.verifyAccessToken.bind(TokenService);
export const verifyRefreshToken =
  TokenService.verifyRefreshToken.bind(TokenService);
