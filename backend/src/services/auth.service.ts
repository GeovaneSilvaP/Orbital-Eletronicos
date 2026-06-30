import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { UserRepositories } from "../repositories/UserRepositories";
import { comparePassword } from "../utils/password.util";

// Define o contrato do que a função de login precisa receber
interface LoginInput {
  email: string;
  password: string;
}

/**
 * Centraliza as regras de negócio para autenticação e geração de tokens.
 */
export class AuthService {
  /**
   * Autentica um usuário e gera um token JWT de 1 dia caso as credenciais estejam corretas.
   * @throws AppError (401) se o e-mail não existir ou a senha estiver incorreta.
   */
  static async login({ email, password }: LoginInput) {
    // 1. Tenta encontrar o usuário pelo e-mail informado
    const user = await UserRepositories.findByEmail(email);

    // Estratégia de segurança: Retorna a mesma mensagem genérica se o usuário não existir
    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    // 2. Compara a senha digitada com o hash salvo com segurança no banco
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    // 3. Cria o token assinado carregando os dados não sensíveis do usuário (payload)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }, // Expira automaticamente em 24 horas
    );

    // Retorna o token gerado e um objeto limpo com os dados do usuário para o Front-end
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
