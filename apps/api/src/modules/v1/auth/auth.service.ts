import prisma from '@/utils/prisma';
import { hash, verify } from '@/utils/hash';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import { SigninBody, SignupBody } from './auth.types';
import createHttpError from 'http-errors';
import { Role, UserStatus } from '@prisma/client';

export class AuthService {
  static async signup(data: SignupBody) {
    const { email, username, password, name, role } = data;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      throw createHttpError(
        409,
        'User with this email or username already exists'
      );
    }

    const hashedPassword = await hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
        role: role ? (role as Role) : Role.USER,
        status: UserStatus.ACTIVE,
      },
    });

    const tokens = this.generateTokens(user.id, user.role);

    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user, ...tokens };
  }

  static async signin(data: SigninBody) {
    const { email_or_username, password } = data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email_or_username }, { username: email_or_username }],
      },
    });

    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw createHttpError(403, `Account is ${user.status.toLowerCase()}`);
    }

    const isValid = await verify(user.password, password);
    if (!isValid) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const tokens = this.generateTokens(user.id, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user, ...tokens };
  }

  static async signout(userId: string) {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  static async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken) {
      throw createHttpError(401, 'Invalid or revoked refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw createHttpError(401, 'User not found');

    const newTokens = this.generateTokens(user.id, user.role);

    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { token } }),
      prisma.refreshToken.create({
        data: {
          token: newTokens.refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return newTokens;
  }

  private static generateTokens(userId: string, role: string) {
    return {
      accessToken: signAccessToken({ sub: userId, role }),
      refreshToken: signRefreshToken({ sub: userId, role }),
    };
  }

  private static async storeRefreshToken(userId: string, token: string) {
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
