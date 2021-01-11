import { ILogUtils } from "@interfaces/utilities";
import pino from "pino";

export class LogUtils implements ILogUtils {
  protected logger: pino.Logger;

  constructor() {
    this.logger = pino();
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    throw new Error("Method not implemented.");
  }
  public info(message?: any, ...optionalParams: any[]): void {
    throw new Error("Method not implemented.");
  }
  public log(message?: any, ...optionalParams: any[]): void {
    throw new Error("Method not implemented.");
  }
  public warning(message?: any, ...optionalParams: any[]): void {
    throw new Error("Method not implemented.");
  }
  public error(message?: any, ...optionalParams: any[]): void {
    throw new Error("Method not implemented.");
  }

  public getPino(): pino.Logger {
    return this.logger;
  }
}
