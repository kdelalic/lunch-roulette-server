import { createLogger, format, transports } from 'winston';
import { Config } from '../config';
import { LoggerInterface } from '../models/loggerInterface';

export default class Logger implements LoggerInterface {
  private logger;

  private messageFormat = format.printf(({ level, message }) => {
    return `[${level}] ${message}`;
  });

  constructor() {
    this.logger = createLogger({
      format: this.messageFormat,
      level: Config.LOGGER_LEVEL,
      levels: Config.LOGGER_LEVELS,
      transports: [new transports.Console()]
    });
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public verbose(message: string): void {
    this.logger.verbose(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }
}
