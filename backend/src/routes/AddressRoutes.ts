import { Router } from "express";
import { AddressControllers } from "../controllers/AddressControllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplica o middleware de autenticação JWT para todas as rotas deste módulo
router.use(authMiddleware);

// Mapeamento dos endpoints para ações do Controller
router.get("/", AddressControllers.getAllByUserId);
router.get("/:id", AddressControllers.getById);
router.post("/", AddressControllers.create);
router.put("/:id", AddressControllers.update);
router.delete("/:id", AddressControllers.delete);

export default router;
