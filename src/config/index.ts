export class Config {
  // Yelp api key
  public static YELP_API_KEY: string = process.env.YELP_API_KEY || '';

  // Production check
  public static DEVELOPMENT_MODE: boolean = process.env.NODE_ENV !== 'production';

  // Highest logger level to use
  public static LOGGER_LEVEL: string = process.env.LOGGER_LEVEL || 'info';

  // Logger levels to use
  public static LOGGER_LEVELS = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 };

  // Port which server is hosted on
  public static PORT = process.env.PORT || 5000;

  // CORS options for allowing only access from specific IPs
  public static CORS_OPTIONS = {
    corsOptions:
      process.env.NODE_ENV === 'production' ? process.env.SERVER_ORIGIN : 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
}
