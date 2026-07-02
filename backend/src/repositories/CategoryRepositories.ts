import { poo } from "../config/database";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";

/**
 * Operações diretas de Banco de Dados para a entidade de Categorias.
 */
export class CategoryRepositories {
  /**
   * Recupera todas as categorias registradas.
   */
  static async findAll(): Promise<Category[]> {
    const [rows] = await poo.query<RowDataPacket[]>("SELECT * FROM categories");
    return rows as Category[];
  }

  /**
   * Busca uma categoria por seu identificador ID.
   */
  static async findById(id: number): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE id = ?",
      [id],
    );
    return (rows[0] as Category) ?? null;
  }

  /**
   * Busca uma categoria pelo nome exato (útil para validações de duplicidade).
   */
  static async findByName(name: string): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE name = ?",
      [name],
    );
    return (rows[0] as Category) ?? null;
  }

  /**
   * Busca uma categoria através da propriedade slug (URL amigável).
   */
  static async findBySlug(slug: string): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE slug = ?",
      [slug],
    );
    return (rows[0] as Category) ?? null;
  }

  /**
   * Salva uma nova categoria na tabela.
   * @returns O ID numérico gerado pelo MySQL.
   */
  static async create(data: CreateCategoryDTO): Promise<number> {
    const [results] = await poo.query<ResultSetHeader>(
      "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)",
      [data.name, data.slug, data.description],
    );
    return results.insertId;
  }

  /**
   * Atualiza as propriedades de uma categoria dinamicamente.
   */
  static async update(id: number, data: UpdateCategoryDTO): Promise<boolean> {
    const fields = Object.keys(data);
    if (fields.length === 0) return false;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = Object.values(data);

    const [results] = await poo.query<ResultSetHeader>(
      `UPDATE categories SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      [...values, id],
    );
    return results.affectedRows > 0;
  }

  /**
   * Remove permanentemente uma categoria pelo ID.
   */
  static async delete(id: number): Promise<boolean> {
    const [results] = await poo.query<ResultSetHeader>(
      "DELETE FROM categories WHERE id = ?",
      [id],
    );
    return results.affectedRows > 0;
  }
}
