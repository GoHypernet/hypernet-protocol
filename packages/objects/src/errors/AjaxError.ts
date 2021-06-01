export class AjaxError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
