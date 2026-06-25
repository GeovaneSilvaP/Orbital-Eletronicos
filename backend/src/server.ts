import app from "./app";
import dotenv from "dotenv";

dotenv.config();

import { connection } from "./config/database";

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await connection();
  console.log(`Servidor rodando na porta: ${port}`);
});
