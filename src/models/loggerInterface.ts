export interface LoggerInterface {
    info(message: string, ...supportData: any[]): void;
    error(message: string, ...supportData: any[]): void;
    warn(message: string, ...supportData: any[]): void;
    debug(message: string, ...supportData: any[]): void;
    trace(message: string, ...supportData: any[]): void;
}
