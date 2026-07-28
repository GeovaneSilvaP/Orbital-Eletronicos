import { AddressRepository } from "../repositories/AddressRepositories";
import {
  CreateAddressInput,
  UpdateAddressInput,
} from "../validations/address.validation";
import { Address } from "../models/address.model";
import { AppError } from "../errors/AppError";

/**
 * Regras de negócio e verificações de segurança para Endereços.
 */
export class AddressServices {
  /**
   * Obtém a lista de endereços do usuário logado.
   */
  static async getAllByUserId(userId: number): Promise<Address[]> {
    return await AddressRepository.findAllByUserId(userId);
  }

  /**
   * Obtém um endereço específico validando a propriedade (Ownership).
   */
  static async findById(id: number, userId: number): Promise<Address> {
    const address = await AddressRepository.findById(id);

    if (!address) {
      throw new AppError("Endereço não encontrado", 404);
    }

    this.ensureOwnership(address, userId);
    return address;
  }

  /**
   * Cria um endereço atrelado ao usuário.
   */
  static async create(userId: number, data: CreateAddressInput) {
    return await AddressRepository.create(userId, data);
  }

  /**
   * Atualiza o endereço após validar se ele existe e se pertence ao usuário solicitante.
   */
  static async update(id: number, userId: number, data: UpdateAddressInput) {
    const address = await this.findById(id, userId);

    const updated = await AddressRepository.update(address.id, userId, data);
    if (!updated) {
      throw new AppError("Endereço não encontrado", 404);
    }
  }

  /**
   * Remove o endereço após validar a propriedade do usuário.
   */
  static async delete(id: number, userId: number) {
    await this.findById(id, userId);
    return await AddressRepository.delete(id);
  }

  /**
   * Valida se o endereço pertence ao usuário autenticado.
   * Lança status 404 intencionalmente (em vez de 403) para não expor a existência de dados de terceiros.
   */
  static ensureOwnership(address: Address, userId: number): void {
    if (address.userId !== userId) {
      // 404 em vez de 403 — não revela que o endereço existe e pertence a outro usuário
      throw new AppError("Endereço não encontrado", 404);
    }
  }
}
