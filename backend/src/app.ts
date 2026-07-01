import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/auth.routes";
import CategoryRoutes from "./routes/CategoryRoutes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// Permite que o servidor receba e entenda payloads no formato JSON
app.use(express.json());

// Ativa o mecanismo de CORS chamando-o como função para permitir acessos externos
app.use(cors());

// Registra os endpoints de usuário no ecossistema do app
app.use("/api", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/categories", CategoryRoutes);
// Registra centralizadamente o tratamento global de erros (DEVE ser sempre o último a ser declarado)
app.use(errorHandler);

export default app;
