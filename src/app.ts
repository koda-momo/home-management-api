import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { apiRouter } from './routes/index';
import { BASE_URL } from './utils/const';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';
import { apiKeyAuth } from './middlewares/authMiddleware';
import { FRONTEND_BASE_URL } from './config/common';

const app = express();

app.use(
  cors({
    origin: FRONTEND_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(BASE_URL, apiKeyAuth, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
