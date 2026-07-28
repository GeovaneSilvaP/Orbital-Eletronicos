/**
 * Representação direta (snake_case) da estrutura da tabela 'products' no MySQL.
 * O campo 'price' vem como string do driver mysql2 quando a coluna é do tipo DECIMAL.
 */
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

/**
 * Modelo de domínio da aplicação TypeScript (padrão camelCase).
 */
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

/**
 * Mapeia o registro vindo do banco de dados (ProductRow) para a interface interna da aplicação (Product).
 * Trata as divergências de nomenclatura (snake_case -> camelCase) e faz a conversão de tipos (string -> number).
 */
export function mapProductRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sku: row.sku,
    price: Number(row.price), // Converte o valor DECIMAL (string) retornado pelo MySQL para number
    stockQuantity: row.stock_quantity,
    categoryId: row.category_id,
    imageUrl: row.image_url,
    isActive: Boolean(row.is_active), // Garante o tipo booleano para o MySQL (que armazena como 0/1)
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
