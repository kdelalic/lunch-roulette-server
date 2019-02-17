import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Config } from './config';
import { Routes } from './routes';
import logger from './utils/logger';

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  private log;

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.log = new logger();

    if (!Config.YELP_API_KEY) {
      this.log.error('YELP_API_KEY is not set. Program stopping.');
      process.exit(0);
    }

    // support application/json type post data
    this.app.use(bodyParser.json());

    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}
export default new App().app;
