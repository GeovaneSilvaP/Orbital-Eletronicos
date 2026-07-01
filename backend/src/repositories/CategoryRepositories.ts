import { poo } from "../config/database";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class CategoryRepositories {
  static async findAll(): Promise<Category[]> {
    const [rows] = await poo.query<RowDataPacket[]>("SELECT * FROM categories");
    return rows as Category[];
  }

  static async findById(id: number): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE id = ?",
      [id],
    );
    return (rows[0] as Category) ?? null;
  }

  static async findByName(name: string): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE name = ?",
      [name],
    );
    return (rows[0] as Category) ?? null;
  }

  static async findBySlug(slug: string): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE slug = ?",
      [slug],
    );
    return (rows[0] as Category) ?? null;
  }

  static async create(data: CreateCategoryDTO): Promise<number> {
    const [results] = await poo.query<ResultSetHeader>(
      "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)",
      [data.name, data.slug, data.description],
    );
    return results.insertId;
  }

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

  static async delete(id: number): Promise<boolean> {
    const [results] = await poo.query<ResultSetHeader>(
      "DELETE FROM categories WHERE id = ?",
      [id],
    );
    return results.affectedRows > 0;
  }
}
