import { UserRepositories } from "../repositories/UserRepositories";
import { CreateUserDTO, UpdateUserDTO, UserPublic } from "../models/user.model";
import { toUserPublic } from "../utils/user.util";
import { hashPassword } from "../utils/password.util";
import { AppError } from "../errors/AppError";

/**
 * Aplica as regras de negócio para as operações de usuários.
 */
export class UserServices {
  /**
   * Obtém a lista de todos os usuários formatada para exibição pública.
   */
  static async getAll(): Promise<UserPublic[]> {
    const users = await UserRepositories.findAll();
    // Transforma o modelo completo do banco para o modelo seguro (sem senha, etc)
    return users.map(toUserPublic);
  }

  /**
   * Obtém os dados públicos de um usuário filtrando por ID.
   * @throws AppError (404) se o usuário não for encontrado.
   */
  static async getById(id: number): Promise<UserPublic> {
    const user = await UserRepositories.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return toUserPublic(user);
  }

  /**
   * Cria um novo usuário após validar se o e-mail está disponível e criptografar a senha.
   * @throws AppError (409) se o e-mail já estiver em uso.
   */
  static async create(data: CreateUserDTO): Promise<UserPublic> {
    // Regra: Não permite e-mails duplicados
    const existing = await UserRepositories.findByEmail(data.email);

    if (existing) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    // Regra de segurança: Nunca salvar a senha em texto limpo
    const hashedPassword = await hashPassword(data.password);
    const id = await UserRepositories.create({
      ...data,
      password: hashedPassword,
    });

    // Busca o usuário criado para devolver seus dados atualizados e limpos
    const user = await UserRepositories.findById(id);
    return toUserPublic(user!);
  }

  /**
   * Altera os dados de um usuário existente fazendo validações de conflito de e-mail e hash de nova senha.
   * @throws AppError (404) se o usuário não existir.
   * @throws AppError (409) se tentar mudar para um e-mail que já pertence a outra pessoa.
   */
  static async update(id: number, data: UpdateUserDTO): Promise<UserPublic> {
    const user = await UserRepositories.findById(id);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    // Se o e-mail está sendo alterado, verifica se o novo já não está em uso por outro usuário
    if (data.email && data.email != user.email) {
      const existing = await UserRepositories.findByEmail(data.email);

      if (existing) {
        throw new AppError("E-mail já cadastrado", 409);
      }
    }

    // Se uma nova senha foi enviada, gera o hash antes de salvar
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    // dados antigos salvos no banco
    await UserRepositories.update(id, data);
    const updated = await UserRepositories.findById(id);
    return toUserPublic(updated!);
  }

  /**
   * Remove um usuário do sistema.
   * @throws AppError (404) se tentar deletar um usuário inexistente.
   */
  static async delete(id: number) {
    const user = await UserRepositories.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    await UserRepositories.delete(id);
  }
}
