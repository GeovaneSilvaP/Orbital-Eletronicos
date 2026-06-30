/**
 * Define os papéis/cargos de acesso permitidos no sistema.
 */
export type UserRole = "CUSTOMER" | "ADMIN";

/**
 * Representação fiel da entidade 'users' mapeada direto do Banco de Dados.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

/**
 * DTO (Data Transfer Object) para Criação de Usuário.
 * Remove os campos gerados automaticamente pelo banco ('id', 'created_at', 'updated_at')
 * e torna o campo 'role' opcional na entrada, assumindo o valor padrão definido no repositório.
 */
export type CreateUserDTO = Omit<
  User,
  "id" | "created_at" | "updated_at" | "role"
> & { role?: UserRole };

/**
 * DTO (Data Transfer Object) para Atualização de Usuário.
 * Todos os campos modificáveis são opcionais.
 *
 * Nota de tipagem: O "| undefined" explícito garante compatibilidade total com o retorno
 * de schemas do Zod (.optional()) quando a flag 'exactOptionalPropertyTypes' está ativa no tsconfig.
 */
export type UpdateUserDTO = {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
};

/**
 * Representação de Usuário para Exibição Pública.
 * Remove a propriedade 'password' da interface original para garantir que dados
 * sensíveis nunca trafeguem pelas respostas HTTP da API.
 */
export type UserPublic = Omit<User, "password">;