import { createLogger, format, transports, loggers } from 'winston';
import { Config } from '../config';
import { LoggerInterface } from '../models/loggerInterface';

export default class Logger implements LoggerInterface {
  private logger;

  constructor() {
    this.logger = createLogger({
      format: format.simple(),
      level: Config.LOGGER_LEVEL,
      levels: Config.LOGGER_LEVELS,
      transports: [new transports.Console()]
    });
  }

  public error(message: string, ...supportingData: any[]): void {
    this.logger.error(message, supportingData);
  }

  public warn(message: string, ...supportingData: any[]): void {
    this.logger.warn(message, supportingData);
  }

  public info(message: string, ...supportingData: any[]): void {
    this.logger.info(message, supportingData);
  }

  public trace(message: string, ...supportingData: any[]): void {
    this.logger.trace(message, supportingData);
  }

  public debug(message: string, ...supportingData: any[]): void {
    this.logger.debug(message, supportingData);
  }
}
