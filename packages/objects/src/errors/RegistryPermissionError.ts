export class RegistryPermissionError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
