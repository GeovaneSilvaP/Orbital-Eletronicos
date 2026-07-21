import {
  Product,
  ProductRow,
  mapProductRowToProduct,
} from "../models/product.model";
import {
  UpdateProductInput,
  CreateProductInput,
} from "../validations/products.validation";
import { poo } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { AppError } from "../errors/AppError";

export class ProductRepository {
  static async findAll(filters?: {
    categoryId?: number;
    isActive?: boolean;
  }): Promise<Product[]> {
    let query = "SELECT * FROM products WHERE 1=1";
    const params: (number | boolean)[] = [];

    if (filters?.categoryId !== undefined) {
      query += " AND category_id = ?";
      params.push(filters.categoryId);
    }

    if (filters?.isActive !== undefined) {
      query += " AND is_active = ?";
      params.push(filters.isActive);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await poo.query<(ProductRow & RowDataPacket)[]>(
      query,
      params,
    );
    return rows.map(mapProductRowToProduct);
  }

  static async findById(id: number): Promise<Product | null> {
    const [rows] = await poo.query<(ProductRow & RowDataPacket)[]>(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [id],
    );

    return rows[0] ? mapProductRowToProduct(rows[0]) : null;
  }

  static async findBySku(sku: string): Promise<Product | null> {
    const [rows] = await poo.query<(ProductRow & RowDataPacket)[]>(
      "SELECT * FROM products WHERE sku = ? LIMIT 1",
      [sku],
    );
    return rows[0] ? mapProductRowToProduct(rows[0]) : null;
  }

  static async create(data: CreateProductInput): Promise<Product> {
    const [result] = await poo.query<ResultSetHeader>(
      "INSERT INTO products (name, description, sku, price, stock_quantity, category_id, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.description,
        data.sku,
        data.price,
        data.stockQuantity,
        data.categoryId,
        data.imageUrl,
        data.isActive,
      ],
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new AppError("Falha ao recuperar produto recém-criado", 404);
    }
    return created;
  }

  static async update(
    id: number,
    data: UpdateProductInput,
  ): Promise<Product | null> {
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    const fieldMaps: Record<string, string> = {
      name: "name",
      description: "description",
      sku: "sku",
      price: "price",
      stockQuantity: "stock_quantity",
      categoryId: "category_id",
      imageUrl: "image_url",
      isActive: "is_active",
    };

    for (const [key, column] of Object.entries(fieldMaps)) {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined) {
        fields.push(`${column} = ?`);
        values.push(value as string | number | boolean | null);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await poo.query<ResultSetHeader>(
      `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await poo.query<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}
