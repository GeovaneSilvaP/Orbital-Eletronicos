import { Router } from "express";
import { ProductController } from "../controllers/ProductControllers"; // Ajustado para a importação do controller correto
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

// Rotas públicas — Qualquer visitante pode visualizar os produtos da loja
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

// Rotas protegidas — Somente administradores autenticados podem gerenciar o estoque/catálogo
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  ProductController.create,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  ProductController.update,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  ProductController.delete,
);

export default router;
