import app from "./app";
import dotenv from "dotenv";
import { connection } from "./config/database";

// Carrega as variáveis do arquivo .env para o `process.env`
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    // Garante que a conexão com o pool do banco de dados está ativa antes de aceitar requisições
    await connection();
    console.log(`Servidor rodando na porta: ${port}`);
  } catch (err) {
    console.error("Falha ao iniciar o banco de dados antes do servidor:", err);
  }
});