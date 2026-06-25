import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const poo: Pool = mysql.createPool({
  user: process.env.DB_USER ?? "root",
  host: process.env.DB_HOST ?? "localhost",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "",
});

export const connection = async () => {
  try {
    const conn = poo.getConnection();
    console.log("Servidor conectado ao banco de dados!");
    (await conn).release();
  } catch (error) {
    console.log("Erro ao conectar com o banco de dados!", error);
  }
};
