export class ProviderRpcError extends Error {
  constructor(public message: string, public code?: number, public data?: any) {
    super(message);
  }
}
