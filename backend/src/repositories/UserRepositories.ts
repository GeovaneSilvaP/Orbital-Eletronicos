import { poo } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { User, CreateUserDTO, UpdateUserDTO } from "../models/user.model";

/**
 * Gerencia a comunicação direta com a tabela 'users' no banco de dados.
 */
export class UserRepositories {
  /**
   * Busca todos os usuários cadastrados no banco.
   * @returns Lista de usuários.
   */
  static async findAll(): Promise<User[]> {
    const [row] = await poo.query<RowDataPacket[]>("SELECT * FROM users");
    return row as User[];
  }

  /**
   * Busca um usuário específico através do ID.
   * @param id Identificador único do usuário.
   * @returns O usuário encontrado ou null caso não exista.
   */
  static async findById(id: number): Promise<User | null> {
    const [row] = await poo.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    return (row[0] as User) ?? null;
  }

  /**
   * Busca um usuário pelo endereço de e-mail.
   * @param email E-mail a ser pesquisado.
   * @returns O usuário encontrado ou null caso não exista.
   */
  static async findByEmail(email: string): Promise<User | null> {
    const [row] = await poo.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    return (row[0] as User) ?? null;
  }

  /**
   * Insere um novo usuário na tabela.
   * @param data Dados para criação (DTO + senha).
   * @returns O ID do usuário recém-criado.
   */
  static async create(
    data: CreateUserDTO & { password: string },
  ): Promise<number> {
    // Define "CUSTOMER" como papel padrão caso nenhum seja enviado
    const [result] = await poo.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [data.name, data.email, data.password, data.role ?? "CUSTOMER"],
    );

    return result.insertId;
  }

  /**
   * Atualiza dinamicamente apenas os campos enviados no banco de dados.
   * @param id Identificador do usuário.
   * @param data Campos que serão atualizados (name, email, etc).
   * @returns true se alterou alguma linha, false se não alterou.
   */
  static async update(id: number, data: UpdateUserDTO): Promise<boolean> {
    const fields = Object.keys(data);
    if (fields.length === 0) return false;

    // Monta a estrutura dinamicamente: "campo1 = ?, campo2 = ?"
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = Object.values(data);

    const [result] = await poo.query<ResultSetHeader>(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      [...values, id],
    );
    return result.affectedRows > 0;
  }

  /**
   * Remove um usuário do banco de dados pelo ID.
   * @param id Identificador do usuário a ser deletado.
   * @returns true se a exclusão foi feita com sucesso, false caso contrário.
   */
  static async delete(id: number): Promise<boolean> {
    const [result] = await poo.query<ResultSetHeader>(
      "DELETE FROM users WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}
