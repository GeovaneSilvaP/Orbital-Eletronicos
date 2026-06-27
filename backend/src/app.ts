import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// Permite que o servidor receba e entenda payloads no formato JSON
app.use(express.json());

// Ativa o mecanismo de CORS chamando-o como função para permitir acessos externos
app.use(cors());

// Registra os endpoints de usuário no ecossistema do app
app.use("/api", UserRoutes);

// Registra centralizadamente o tratamento global de erros (DEVE ser sempre o último a ser declarado)
app.use(errorHandler);

export default app;
