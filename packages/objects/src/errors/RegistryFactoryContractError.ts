export class RegistryFactoryContractError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
