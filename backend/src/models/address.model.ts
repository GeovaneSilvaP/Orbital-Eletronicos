/**
 * Representa a estrutura exata (snake_case) da tabela 'addresses' no banco de dados MySQL.
 */
export interface AddressRow {
  id: number;
  user_id: number;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Interface limpa utilizada pela aplicação TypeScript (padrão camelCase).
 */
export interface Address {
  id: number;
  userId: number;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mapeia o retorno bruto do banco MySQL (AddressRow) para o modelo padrão da aplicação (Address).
 * Trata conversões de nomenclatura (snake_case -> camelCase) e garante o tipo booleano.
 */
export function mapAddressRowToAddress(row: AddressRow): Address {
  return {
    id: row.id,
    userId: row.user_id,
    street: row.street,
    number: row.number,
    complement: row.complement,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
