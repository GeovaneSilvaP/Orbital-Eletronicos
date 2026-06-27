import { UserControllers } from "../controllers/UserControllers";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/user.validation";
import { validate } from "../middlewares/validate.middleware";
import { Router } from "express";

const router = Router();

// Rotas públicas ou de leitura direta
router.get("/users", UserControllers.getAll);
router.get("/users/:id", UserControllers.getById);

// Rotas com barreira de proteção: os dados do body passam pela validação do Zod antes de chegar no Controller
router.post("/users", validate(createUserSchema), UserControllers.create);
router.put("/users/:id", validate(updateUserSchema), UserControllers.update);

router.delete("/users/:id", UserControllers.delete);

export default router;
