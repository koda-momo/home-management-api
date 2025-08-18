import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './routes/index.js';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/v1', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
