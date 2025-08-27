import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { apiRouter } from './routes/index';
import { BASE_URL } from './utils/const';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(BASE_URL, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
