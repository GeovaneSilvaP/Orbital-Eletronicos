/**
 * Classe customizada de erro para padronizar as respostas de falha na API.
 * Permite interceptar o erro de forma clara no middleware global de tratamento.
 */
export class AppError extends Error {
  // Código de status HTTP (ex: 400, 401, 404, 409)
  public readonly statusCode: number;

  // Indica se o erro é conhecido/esperado pela aplicação (true) ou um crash inesperado (false)
  public readonly isOperational: boolean;

  /**
   * @param message Mensagem amigável explicando o erro.
   * @param statusCode Código HTTP associado à falha (Padrão: 400).
   * @param isOperational Define se é um erro de fluxo de negócio controlado (Padrão: true).
   */
  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Ajusta o protótipo para que o operador 'instanceof AppError' funcione corretamente no TypeScript
    Object.setPrototypeOf(this, AppError.prototype);

    // Captura e limpa o histórico de chamadas (Stack Trace) para ocultar o construtor do erro
    Error.captureStackTrace(this, this.constructor);
  }
}
