import bcrypt from "bcryptjs";

// Número de fatores de custo que o algoritmo bcrypt usará (quanto maior, mais seguro e lento)
const SALT_ROUNDS = 10;

/**
 * Transforma uma senha em texto limpo em um hash criptográfico seguro.
 * @param password A senha digitada pelo usuário.
 * @returns A senha criptografada de forma irreversível.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara uma senha em texto limpo com um hash salvo no banco para checar se são iguais.
 * @param password A senha digitada na tentativa de login.
 * @param hash O hash seguro que veio do banco de dados.
 * @returns true se as senhas coincidirem, false caso contrário.
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
