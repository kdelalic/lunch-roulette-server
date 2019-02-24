import axios, { AxiosError, AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { Config } from '../config';

export class Routes {
  private readonly YELP_API_KEY: string = Config.YELP_API_KEY;

  public routes(app, log): void {
    // Route for REST Yelp restaurants api
    app.route('/api/restaurants').get((req: Request, res: Response) => {
      const { latitude, longitude, offset, limit } = req.query;
      const term = 'restaurants'; // Search term

      // Log request
      log.trace(
        `{latitude: ${latitude}, longitude: ${longitude}, offset: ${offset}, limit: ${limit}} from ${
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
          '&radius=5000'
      })
        .then((result: AxiosResponse) => {
          // Return response back to our API
          res.send(result.data.businesses);
        })
        .catch((error: AxiosError) => {
          // Handle error
          if (error.response) {
            const { code, description } = error.response.data.error;
            log.error(`${error.response.status} ${code} ${description}`);
          } else if (error.request) {
            log.error(error.request);
          } else {
            log.error(error.message);
          }
        });
    });

    // Route for GraphQL Yelp restaurants api
    app.route('/api/graphql/restaurants').get((req: Request, res: Response) => {
      const { latitude, longitude, offset, limit } = req.query;
      const term = 'restaurants';

      // Log request
      log.trace(
        `{latitude: ${latitude}, longitude: ${longitude}, offset: ${offset}, limit: ${limit}}
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
            offset: ${offset}
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
          // Return response back to our API
          res.send(result.data.data.search.business);
        })
        .catch((error: AxiosError) => {
          // Handle error
          if (error.response) {
            const { code, description } = error.response.data.error;
            log.error(`${error.response.status} ${code} ${description}`);
          } else if (error.request) {
            log.error(error.request);
          } else {
            log.error(error.message);
          }
        });
    });
  }
}
