/**
 * ProxyError is raised when a proxy can not be created or communication
 * can not be established. This is a fatal error for that proxy, but
 * retrying is still logical.
 */
export class ProxyError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
