import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import JWT from 'jsonwebtoken';
import { verifyAccessToken, verifyRefreshToken } from '@/utils/jwt';

export class AuthMiddleware {
  static access(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.accessToken;

      if (!accessToken) {
        throw createError(401, {
          message: 'Unauthorized',
          code: 'NO_ACCESS_TOKEN',
        });
      }

      const { sub, type, role } = verifyAccessToken(accessToken);

      if (!sub || type !== 'access') {
        throw createError(401, {
          message: 'Invalid access token',
          code: 'INVALID_ACCESS_TOKEN',
        });
      }

      (req as any).user = { id: sub, role };

      next();
    } catch (error) {
      if (
        error instanceof JWT.JsonWebTokenError ||
        error instanceof JWT.TokenExpiredError
      ) {
        next(
          createError(401, {
            message: 'Access token expired or invalid',
            code: 'JWT_EXPIRED',
          })
        );
      } else {
        next(error);
      }
    }
  }

  static refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const refreshToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.refreshToken;

      if (!refreshToken) {
        throw createError(401, {
          message: 'Unauthorized',
          code: 'NO_REFRESH_TOKEN',
        });
      }

      const { sub, type } = verifyRefreshToken(refreshToken);

      if (!sub || type !== 'refresh') {
        throw createError(401, {
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN',
        });
      }

      (req as any).user = { id: sub };

      next();
    } catch (error) {
      if (
        error instanceof JWT.JsonWebTokenError ||
        error instanceof JWT.TokenExpiredError
      ) {
        next(
          createError(401, {
            message: 'Refresh token expired or invalid',
            code: 'JWT_EXPIRED',
          })
        );
      } else {
        next(error);
      }
    }
  }

  static role(requiredRole: 'ADMIN' | 'USER') {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!(req as any).user) {
          AuthMiddleware.access(req, res, () => {});
        }

        const userRole = (req as any).user?.role;

        if (userRole !== requiredRole) {
          throw createError(403, {
            message: `Forbidden: Requires ${requiredRole} role`,
            code: 'FORBIDDEN_ROLE',
          });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
