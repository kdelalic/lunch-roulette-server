import axios, { AxiosError, AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { Config } from '../config';

export class Routes {
  private readonly YELP_API_KEY: string = Config.YELP_API_KEY;
  private readonly MAXIMUM_RADIUS: number = Config.MAXIMUM_RADIUS;
  private log;

  constructor(log) {
    this.log = log;
  }

  public routes(app): void {
    // REST Yelp GET restaurants search api
    app.route('/api/restaurants').get((req: Request, res: Response) => {
      const { latitude, longitude, offset, limit, radius } = req.query;
      const term = 'restaurants'; // Search term

      if (radius > this.MAXIMUM_RADIUS) {
        res.status(400).send({ error: `Radius must be at most ${this.MAXIMUM_RADIUS}` });
      }

      // Log request
      this.log.verbose(
        `{latitude: ${latitude}, longitude: ${longitude}, offset: ${offset}, limit: ${limit}, radius: ${radius}} from ${
          req.headers.origin
        } (${req.headers['user-agent']})`
      );

      // Call GET request to yelp api
      axios({
        headers: {
          Authorization: this.YELP_API_KEY
        },
        method: 'get',
        url:
          'https://api.yelp.com/v3/businesses/search' +
          `?term=${term}` +
          `&latitude=${latitude}` +
          `&longitude=${longitude}` +
          `&offset=${offset}` +
          `&limit=${limit}` +
          `&radius=${radius}`
      })
        .then((result: AxiosResponse) => {
          this.log.verbose(`GET/api/restaurants response: ${result.data}`);

          // Return response back to our API
          res.send(result.data.businesses);
        })
        .catch((error: AxiosError) => {
          this.handleError(res, error);
        });
    });

    // GraphQL Yelp GET restaurants search api
    app.route('/api/graphql/restaurants').get((req: Request, res: Response) => {
      const { latitude, longitude, offset, limit, radius } = req.query;
      const term = 'restaurants';

      if (radius > this.MAXIMUM_RADIUS) {
        res.status(400).send({ error: `Radius must be at most ${this.MAXIMUM_RADIUS}` });
      }

      // Log request
      this.log.verbose(
        `{latitude: ${latitude}, longitude: ${longitude}, offset: ${offset}, limit: ${limit}, radius: ${radius}}
         from ${req.headers.origin} (${req.headers['user-agent']})`
      );

      // Call GET request to Yelp GraphQL API
      axios({
        data: `{
          search(
            term: ${term},
            latitude: ${latitude},
            longitude: ${longitude},
            limit: ${limit},
            offset: ${offset},
            radius: ${radius}
          ) {
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
        }`,
        headers: {
          Authorization: this.YELP_API_KEY
        },
        method: 'post',
        url: 'https://api.yelp.com/v3/graphql'
      })
        .then((result: AxiosResponse) => {
          this.log.verbose(`GraphQL GET/api/restaurants response: ${result.data}`);

          // Return response back to our API
          res.send(result.data.data.search.business);
        })
        .catch((error: AxiosError) => {
          this.handleError(res, error);
        });
    });

    // REST Yelp GET reviews by restaurant id api
    app.route('/api/reviews/:restaurant_id').get((req: Request, res: Response) => {
      const { restaurant_id } = req.params;

      // Log request
      this.log.verbose(
        `{restaurant_id: ${restaurant_id}, from ${req.headers.origin} (${
          req.headers['user-agent']
        })`
      );

      // Call GET request to yelp api
      axios({
        headers: {
          Authorization: this.YELP_API_KEY
        },
        method: 'get',
        url: `https://api.yelp.com/v3/businesses/${restaurant_id}/reviews`
      })
        .then((result: AxiosResponse) => {
          this.log.verbose(`GET/api/reviews/ response: ${result.data}`);

          // Return response back to our API
          res.send(result.data);
        })
        .catch((error: AxiosError) => {
          this.handleError(res, error);
        });
    });
  }

  private handleError(res: Response, error: AxiosError): void {
    // Handle error
    if (error.response) {
      const { code, description } = error.response.data.error;
      this.log.error(`${error.response.status} ${code} ${description}`);
      res.sendStatus(500);
    } else if (error.request) {
      this.log.error(error.request);
      res.sendStatus(500);
    } else {
      this.log.error(error.message);
      res.sendStatus(500);
    }
  }
}
