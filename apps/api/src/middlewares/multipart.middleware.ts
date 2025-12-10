import { Request, Response, NextFunction } from 'express';

export class MultipartMiddleware {
  static normalize(jsonFields: string[] = []) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.body) {
        return next();
      }

      for (const key of jsonFields) {
        const value = req.body[key];

        if (typeof value === 'string') {
          try {
            req.body[key] = JSON.parse(value);
          } catch {}
        }
      }
      next();
    };
  }
}
