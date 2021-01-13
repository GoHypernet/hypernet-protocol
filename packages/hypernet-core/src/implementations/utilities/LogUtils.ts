import { ILogUtils } from "@interfaces/utilities";
import pino from "pino";

export class LogUtils implements ILogUtils {
  protected logger: pino.Logger;

  constructor() {
    this.logger = pino();
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    this.logger.debug(message, optionalParams);
  }
  public info(message?: any, ...optionalParams: any[]): void {
    this.logger.info(message, optionalParams);
  }
  public log(message?: any, ...optionalParams: any[]): void {
    this.logger.log(message, optionalParams);
  }
  public warning(message?: any, ...optionalParams: any[]): void {
    this.logger.warn(message, optionalParams);
  }
  public error(message?: any, ...optionalParams: any[]): void {
    this.logger.error(message, optionalParams);
  }

  public getPino(): pino.Logger {
    return this.logger;
  }
}
