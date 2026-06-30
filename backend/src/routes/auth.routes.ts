import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

// Endpoint do tipo POST para envio seguro das credenciais no body
authRouter.post("/login", AuthController.login);

export default authRouter;