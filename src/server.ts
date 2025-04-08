import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '@src/routes/auth';
import healthRoute from '@src/routes/health';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoute)

export default app;