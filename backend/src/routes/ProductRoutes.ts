import { Router } from 'express';
import { CategoryControllers } from '../controllers/CategoryControllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// Rotas públicas — qualquer visitante pode ver o catálogo
router.get('/', CategoryControllers.getAll);
router.get('/:id', CategoryControllers.getById);

// Rotas protegidas — apenas ADMIN gerencia o catálogo
router.post('/', authMiddleware, authorize(['ADMIN']), CategoryControllers.create);
router.put('/:id', authMiddleware, authorize(['ADMIN']), CategoryControllers.update);
router.delete('/:id', authMiddleware, authorize(['ADMIN']), CategoryControllers.delete);

export default router;