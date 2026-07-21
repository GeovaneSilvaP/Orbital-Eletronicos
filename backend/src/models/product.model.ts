// Representação da linha no banco (snake_case)
export interface ProductRow {
  id: number;
  name: string;
  description: string | null;
  sku: string;
  price: string;
  stock_quantity: number;
  category_id: number;
  image_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Representação da aplicação (camelCase)
export interface Product {
  id: number;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function mapProductRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sku: row.sku,
    price: Number(row.price),
    stockQuantity: row.stock_quantity,
    categoryId: row.category_id,
    imageUrl: row.image_url,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
