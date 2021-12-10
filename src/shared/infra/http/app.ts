import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { JsonWebTokenError } from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';

import upload from '@config/upload';
import { AppError } from '@shared/errors/AppError';
import createConnection from '@shared/infra/typeorm';

import swaggerFile from '../../../swagger.json';
import rateLimiter from './middleware/reateLimeter';
import '@shared/container';
import { router } from './routes/index';

createConnection();
const app = express();

app.use(rateLimiter);

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/avatar', express.static(`${upload.tempFolder}/avatar`));
app.use('/car', express.static(`${upload.tempFolder}/car`));
app.use(cors());
app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err) {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          message: err.message,
        });
      }
      if (err instanceof JsonWebTokenError) {
        const message =
          err.message === 'invalid signature' ? 'invalid token' : err.message;
        return response.status(403).json({
          message,
        });
      }
      return response.status(500).json({
        status: 'error',
        message: `Internal server error ${err.message}`,
      });
    }
    return next();
  }
);

export { app };
