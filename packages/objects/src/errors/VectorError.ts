import errorCodes from "@objects/errors/errorCodes";

export class VectorError extends Error {
  //protected errorCode: string = errorCodes[VectorError.name];
  constructor(public sourceError?: Error, message?: string) {
    super(message);
  }
}
