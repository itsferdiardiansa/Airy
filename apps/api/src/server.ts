import 'dotenv/config';
import app from './app';
import { config } from './config/config';
import prisma from './utils/prisma';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    logger.info('⏳ Connecting to database...');
    await prisma.$connect();
    logger.info('Database connected successfully.');

    const server = app.listen(config.port, () => {
      logger.info(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      setTimeout(() => {
        logger.error(
          'Could not close connections in time, forcefully shutting down'
        );
        process.exit(1);
      }, 10000);

      server.close(async () => {
        logger.info('HTTP server closed.');

        try {
          await prisma.$disconnect();
          logger.info('Database connection closed.');
          process.exit(0);
        } catch (err) {
          logger.error({ err }, 'Error during database disconnection');
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught Exception thrown');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'Unhandled Rejection caught');
  process.exit(1);
});

bootstrap();
