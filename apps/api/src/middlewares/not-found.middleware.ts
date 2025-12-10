import { Request, Response, NextFunction } from 'express';

export class NotFoundMiddleware {
  static handle(_req: Request, res: Response, _next: NextFunction) {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      code: 'NOT_FOUND',
    });
  }
}
