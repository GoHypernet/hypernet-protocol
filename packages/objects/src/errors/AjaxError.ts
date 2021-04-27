export class AjaxError extends Error {
    constructor(message?: string, protected src?: unknown) {
        super(message);
    }
}