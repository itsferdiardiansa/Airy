import pino, { LoggerOptions } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const pinoConfig: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      "res.headers['set-cookie']",
      'req.body.password',
      'req.body.token',
      'res.body.accessToken',
      'res.body.refreshToken',
    ],
    censor: '[REDACTED]',
  },
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
          singleLine: true,
          messageFormat:
            '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        },
      }
    : undefined,
};

export const logger = pino(pinoConfig);
