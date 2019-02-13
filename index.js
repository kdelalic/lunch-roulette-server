const express = require('express');
const { createLogger, format, transports } = require('winston');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const { YELP_API_KEY, NODE_ENV, SERVER_ORIGIN, LOGGER_LEVEL } = process.env;

const logger = createLogger({
  level: LOGGER_LEVEL || 'info',
  levels: { error: 0, warn: 1, query: 2, info: 3, verbose: 4, debug: 5 },
  format: format.simple(),
  transports: [new transports.Console()]
});

if (!YELP_API_KEY) {
  logger.error('YELP_API_KEY is not set. Program stopping.');
  process.exit(0);
}

const corsOptions = {
  corsOptions: NODE_ENV === 'production' ? SERVER_ORIGIN : 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/api/graphql/restaurants', (req, res) => {
  const { latitude, longitude, offset, limit } = req.query;

  logger.query(
    `{latitude: ${latitude}, longitude: ${longitude}, offset: ${offset}, limit: ${limit}} from ${
      req.headers.origin
    } (${req.headers['user-agent']})`
  );

  axios({
    url: 'https://api.yelp.com/v3/graphql',
    method: 'post',
    headers: {
      Authorization: YELP_API_KEY
    },
    data: `{
        search(term: "restaurants", latitude: ${latitude}, longitude: ${longitude}, limit: ${limit}, offset: ${offset}) {
          business {
            name
            rating
            review_count
            location {
              address1
              city
            }
          }
        }
      }`
  })
    .then(result => {
      res.send(result.data.data.search.business);
    })
    .catch(err => {
      logger.error('GET/api/graphql/restaurants', err.response.data.error);
    });
});

app.get('/api/restaurants', (req, res) => {
  const { latitude, longitude, offset, limit } = req.query;
  const term = 'restaurants';

  logger.query(
    `{latitude: ${latitude}, longitude: ${longitude}, offset: ${offset}, limit: ${limit}} from ${
      req.headers.origin
    } (${req.headers['user-agent']})`
  );

  const url =
    `https://api.yelp.com/v3/businesses/search` +
    `?term=${term}` +
    `&latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&offset=${offset}` +
    `&limit=${limit}`;

  axios({
    url,
    method: 'get',
    headers: {
      Authorization: YELP_API_KEY
    }
  })
    .then(result => {
      res.send(result.data.businesses);
    })
    .catch(err => {
      logger.error('GET/api/restaurants', err.response.data.error);
    });
});

app.listen(port, () => logger.info(`Server is listening on port ${port}.`));
