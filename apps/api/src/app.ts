import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { httpLogger } from './utils/http-logger';
import { config } from './config/config';
import routes from './routes';
import { NotFoundMiddleware } from './middlewares/not-found.middleware';
import { ErrorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(httpLogger);
app.use('/api', routes);

app.use(NotFoundMiddleware.handle);
app.use(ErrorMiddleware.handle);

export default app;
