import app from './app';
import { Config } from './config';
import logger from './utils/logger';

const log = new logger();

app.listen(Config.PORT, () => log.info(`Server is listening on port ${Config.PORT}.`));
