import { User, UserPublic } from "../models/user.model";

/**
 * Remove dados sensíveis (como a senha) do objeto de usuário retornado pelo banco.
 * Garante que dados confidenciais nunca sejam enviados na resposta para o cliente.
 *
 * @param user O objeto de usuário completo vindo do banco de dados.
 * @returns O objeto de usuário "limpo", contendo apenas os dados públicos seguros.
 */
export const toUserPublic = (user: User): UserPublic => {
  // Usa desestruturação para separar o password e agrupar o resto no objeto UserPublic
  const { password, ...UserPublic } = user;
  return UserPublic;
};
