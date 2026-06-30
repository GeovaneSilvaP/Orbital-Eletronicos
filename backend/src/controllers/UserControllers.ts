import { UserServices } from "../services/UserServices";
import { NextFunction, Request, Response } from "express";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/user.validation";

/**
 * Intercepta as requisições HTTP e gerencia as respostas da API para o recurso de Usuários.
 */
export class UserControllers {
  /**
   * Retorna a lista completa de usuários com status 200.
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserServices.getAll();
      return res
        .status(200)
        .json({ message: "Todos os usuários encontrados!", users });
    } catch (error) {
      next(error); // Encaminha o erro capturado para o middleware global de erros
    }
  }

  /**
   * Extrai o ID dos parâmetros da URL e busca o usuário correspondente.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await UserServices.getById(id);
      return res
        .status(200)
        .json({ message: "Usuário encontrado por Id!", user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recebe os dados de criação validados no corpo da requisição e cria o usuário.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Valida e filtra o body — "role" nunca existe nesse schema,
      // então mesmo que venha no JSON, é descartado aqui.
      const data = createUserSchema.parse(req.body);
      const user = await UserServices.create(data);
      return res
        .status(201)
        .json({ message: "Usuário criado com sucesso!", user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Extrai o ID e os dados enviados para modificar as informações de um usuário existente.
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = updateUserSchema.parse(req.body);
      const user = await UserServices.update(id, data);
      return res
        .status(200)
        .json({ message: "Dados do usuário atualizado com sucesso!", user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove o usuário informado pelo ID e retorna status 204 (No Content) sem corpo na resposta.
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await UserServices.delete(id);
      // Status 204 indica que a ação foi concluída e não há conteúdo a retornar
      return res
        .status(204)
        .json({ message: "Usuário excluído com sucesso!", user });
    } catch (error) {
      next(error);
    }
  }
}
