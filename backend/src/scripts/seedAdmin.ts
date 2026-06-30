import { poo, connection } from "../config/database";
import { UserServices } from "../services/UserServices";
import dotenv from "dotenv";

dotenv.config();

async function seedAdmin() {
  await connection();

  const name = process.env.ADMIN_NAME ?? "Administrador";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ADMIN_EMAIL e ADMIN_PASSWORD precisam estar no .env");
    process.exit(1);
  }

  try {
    const admin = await UserServices.create({
      name,
      email,
      password,
      role: "ADMIN",
    });
    console.log("Admin criado com sucesso:", admin.email);
  } catch (err: any) {
    console.error("Erro ao criar admin:", err.message ?? err);
  } finally {
    await poo.end();
    process.exit(0);
  }
}

seedAdmin();
