import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const profileController = new ProfileController();

router.get('/', authMiddleware, profileController.getProfile);
router.put('/:id', authMiddleware, profileController.updateProfile);

export default router; 