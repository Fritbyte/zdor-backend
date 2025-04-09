import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '@src/routes/auth';
import healthRoute from '@src/routes/health';
import profileRoutes from '@src/routes/profile';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoute);
app.use('/api/profile', profileRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Внутренняя ошибка сервера'
  });
});

export default app;