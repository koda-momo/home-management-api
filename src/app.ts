import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './routes/index';
import { BASE_URL } from './utils/const';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(BASE_URL, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
