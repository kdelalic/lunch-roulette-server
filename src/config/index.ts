export class Config {
  // Yelp api key
  public static YELP_API_KEY: string = process.env.YELP_API_KEY || '';

  public static DEVELOPMENT_MODE: boolean = process.env.NODE_ENV !== 'production';

  public static LOGGER_LEVEL: string = process.env.LOGGER_LEVEL || 'info';

  public static LOGGER_LEVELS = { error: 0, warn: 1, info: 2, trace: 3, debug: 4 };

  public static PORT = process.env.PORT || 5000;

  public static CORS_OPTIONS = {
    corsOptions:
      process.env.NODE_ENV === 'production' ? process.env.SERVER_ORIGIN : 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
}
