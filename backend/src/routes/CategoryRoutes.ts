import { CategoryControllers } from "../controllers/CategoryControllers";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

// Leitura pública (catálogo da loja)
router.get("/", CategoryControllers.getAll);
router.get("/:id", CategoryControllers.getById);

// Escrita só pra ADMIN
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  CategoryControllers.create,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  CategoryControllers.update,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  CategoryControllers.delete,
);

export default router;
