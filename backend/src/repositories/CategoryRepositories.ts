import { poo } from "../config/database";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class CategoryRepositories {
  static async findAll(): Promise<Category[]> {
    const [rows] = await poo.query<RowDataPacket[]>("");
    return rows as Category[];
  }

  static async findById(id: number): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>("", [id]);
    return (rows[0] as Category) ?? null;
  }

  static async findByName(name: string): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>("", [name]);
    return (rows[0] as Category) ?? null;
  }

  static async findBySlug(slug: string): Promise<Category | null> {
    const [rows] = await poo.query<RowDataPacket[]>("", [slug]);
    return (rows[0] as Category) ?? null;
  }

  static async create(data: CreateCategoryDTO) {
    
  }

  static async update(id: number, data: UpdateCategoryDTO) {

  }
  static async delete(id: number) {

  }
}
