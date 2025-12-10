import pinoHttp from 'pino-http';
import { logger } from './logger';
import { IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

interface RequestWithAuth extends IncomingMessage {
  headers: IncomingMessage['headers'] & {
    authorization?: string;
  };
}

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req: IncomingMessage) =>
    req.headers['x-request-id'] || randomUUID(),
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req) => `${req.method} ${req.url} completed`,
  customErrorMessage: (req, _res, err) =>
    `${req.method} ${req.url} failed: ${err.message}`,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        remoteAddress: req.remoteAddress,
        userAgent: req.headers['user-agent'],
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
  customProps: (req: IncomingMessage, res: ServerResponse) => {
    let userId: string | undefined;
    const authHeader = (req as RequestWithAuth).headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.decode(token) as { sub?: string } | null;
        userId = decoded?.sub;
      } catch {}
    }

    return {
      userId,
      responseTime: res.getHeader('X-Response-Time'),
    };
  },
});
