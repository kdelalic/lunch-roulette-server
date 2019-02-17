import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Config } from './config';
import { Routes } from './routes';
import logger from './utils/logger';

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  private log;

  constructor() {
    // Creates new express app
    this.app = express();
    // Runs application configuration
    this.config();
    // Initializes routes
    this.routePrv.routes(this.app);
  }

  // Configures the express application
  private config(): void {
    // Initializes logger
    this.log = new logger();

    // Checks if Yelp api key is present in environment
    if (!Config.YELP_API_KEY) {
      this.log.error('YELP_API_KEY is not set. Program stopping.');
      process.exit(0);
    }

    // Sets CORS options from config file
    this.app.use(cors(Config.CORS_OPTIONS));

    // support application/json type post data
    this.app.use(bodyParser.json());
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;
