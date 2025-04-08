import { Router } from 'express';

const healthRoute = Router();

healthRoute.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default healthRoute;