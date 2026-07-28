import { Router } from "express";
import { OrderControllers } from "../controllers/OrderControllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// Todas as rotas de pedidos exigem autenticação prévia
router.use(authMiddleware);

// Rotas do cliente logado
router.post("/", OrderControllers.create);
router.get("/byuser", OrderControllers.getAllByUser);
router.get("/:id", OrderControllers.getById);
router.patch("/:id/status", OrderControllers.updateStatus);

// Rota administrativa — lista todos os pedidos do sistema, com filtro opcional por status
router.get("/", authorize(["ADMIN"]), OrderControllers.getAllAdmin);

export default router;