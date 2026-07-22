import { poo } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
  Address,
  AddressRow,
  mapAddressRowToAddress,
} from "../models/address.model";
import {
  CreateAddressInput,
  UpdateAddressInput,
} from "../validations/address.validation";

export class AddressRepository {
  static async findAllByUserId(userId: number): Promise<Address[]> {
    const [rows] = await poo.query<(AddressRow & RowDataPacket)[]>(
      "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC",
      [userId],
    );
    return rows.map(mapAddressRowToAddress);
  }

  static async findById(id: number): Promise<Address | null> {
    const [rows] = await poo.query<(AddressRow & RowDataPacket)[]>(
      "SELECT * FROM addresses WHERE id = ? LIMIT 1",
      [id],
    );
    return rows[0] ? mapAddressRowToAddress(rows[0]) : null;
  }

  static async create(
    userId: number,
    data: CreateAddressInput,
  ): Promise<Address> {
    const connection = await poo.getConnection();

    try {
      await connection.beginTransaction();

      if (data.isDefault) {
        await connection.query(
          "UPDATE addresses SET is_default = false WHERE user_id = ?",
          [userId],
        );
      }

      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO addresses (user_id, street, number, complement, neighborhood, city, state, zip_code, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          data.street,
          data.number,
          data.complement ?? null,
          data.neighborhood,
          data.city,
          data.state,
          data.state,
          data.zipCode,
          data.isDefault,
        ],
      );

      await connection.commit();

      const created = await this.findById(result.insertId);
      if (!created) {
        throw new Error("Falha ao recuperar endereço recém-criado");
      }
      return created;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(
    id: number,
    userId: number,
    data: UpdateAddressInput,
  ): Promise<Address | null> {
    const connection = await poo.getConnection();

    try {
      await connection.beginTransaction();

      if (data.isDefault === true) {
        await connection.query(
          "UPDATE addresses SET is_default = false WHERE user_id = ? AND id != ?",
          [userId, id],
        );
      }

      const fields: string[] = [];
      const values: (string | number | boolean | null)[] = [];

      const fielMap: Record<string, string> = {
        street: "street",
        number: "number",
        complement: "complement",
        neighborhood: "neighborhood",
        city: "city",
        state: "state",
        zipCode: "zip_code",
        isDefault: "is_default",
      };

      for (const [key, column] of Object.entries(fielMap)) {
        const value = (data as Record<string, unknown>)[key];
        if (value !== undefined) {
          fields.push(`${column} = ?`);
          values.push(value as string | number | boolean | null);
        }
      }

      if (fields.length > 0) {
        values.push(id);
        await connection.query<ResultSetHeader>(
          `UPDATE addresses SET ${fields.join(", ")} WHERE id = ?`,
          values,
        );
      }

      await connection.commit();
      return this.findById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await poo.query<ResultSetHeader>(
      "DELETE FROM addresses WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}
