export class MessagingError extends Error {
  constructor(message?: string, protected src?: unknown) {
    super(message);
  }
}
