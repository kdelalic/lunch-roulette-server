import axios, { AxiosError, AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { Config } from '../config';

export class Routes {
  public routes(app): void {
    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'GET request successfulll!!!!'
      });
    });

    app.route('/api/graphql/restaurants').get((req: Request, res: Response) => {
      const { latitude, longitude, offset, limit } = req.query;

      app.trace(
        `{latitude: ${latitude}, longitude: ${longitude}, offset: ${offset}, limit: ${limit}}
         from ${req.headers.origin} (${req.headers['user-agent']})`
      );

      axios({
        data: `{
          search(
            term: "restaurants",
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
          Authorization: Config.YELP_API_KEY
        },
        method: 'post',
        url: 'https://api.yelp.com/v3/graphql'
      })
        .then((result: AxiosResponse) => {
          res.send(result.data.data.search.business);
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            const { code, description } = error.response.data.error;
            app.error(`${error.response.status} ${code} ${description}`);
          } else if (error.request) {
            app.error(error.request);
          } else {
            app.error(error.message);
          }
        });
    });

    app.route('/api/restaurants').get((req: Request, res: Response) => {
      const { latitude, longitude, offset, limit } = req.query;
      const term = 'restaurants';

      app.trace(
        `{latitude: ${latitude}, longitude: ${longitude}, offset: ${offset}, limit: ${limit}}
         from ${req.headers.origin} (${req.headers['user-agent']})`
      );

      axios({
        headers: {
          Authorization: Config.YELP_API_KEY
        },
        method: 'get',
        url:
          'https://api.yelp.com/v3/businesses/search' +
          `?term=${term}` +
          `&latitude=${latitude}` +
          `&longitude=${longitude}` +
          `&offset=${offset}` +
          `&limit=${limit}`
      })
        .then((result: AxiosResponse) => {
          res.send(result.data.businesses);
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            const { code, description } = error.response.data.error;
            app.error(`${error.response.status} ${code} ${description}`);
          } else if (error.request) {
            app.error(error.request);
          } else {
            app.error(error.message);
          }
        });
    });
  }
}
