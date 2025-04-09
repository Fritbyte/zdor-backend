import app from '@src/server';
import dotenv from 'dotenv';
import { createTables } from '@src/config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await createTables();
    const server = app.listen(PORT);

    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Сервер остановлен');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Сервер остановлен');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера: ', error);
    process.exit(1);
  }
};

startServer().then(() => console.log(`🚀 Сервер запущен на порту ${PORT}`));
