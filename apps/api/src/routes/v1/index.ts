import { Router } from 'express';
import authRoutes from './auth.routes';
import employeesRoutes from './employees.routes';
import userRoutes from './users.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeesRoutes);
router.use('/users', userRoutes);

export default router;
