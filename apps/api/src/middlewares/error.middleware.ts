import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

export class ErrorMiddleware {
  static handle(err: any, req: Request, res: Response, _next: NextFunction) {
    const status = err.status || 500;

    if (status >= 500) {
      logger.error(
        {
          err,
          req: {
            method: req.method,
            url: req.url,
            body: req.body,
          },
        },
        'Unhandled Server Error'
      );
    }

    res.status(status).json({
      success: false,
      error: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_SERVER_ERROR',
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
}
