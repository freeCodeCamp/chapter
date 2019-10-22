import { Router } from './Router';
import { Request, Response } from 'express';
import { BadRequestError } from 'express-response-errors';

export class ExampleRouter extends Router {
  private sampleRoute(req: Request, res: Response) {
    const { query } = req;
    res.json({ message: 'Response from the server', query });
  }

  private async sampleAsyncRoute(req: Request, res: Response) {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const { query } = req;
    res.json({ message: 'Delayed response from the server', query });
  }

  private sampleErroredRoute() {
    throw new BadRequestError('This route will always error with code 400');
  }

  protected registerRoutes(): void {
    this.router.get('/sample-route', this.sampleRoute);
    this.router.get('/sample-async-route', this.sampleAsyncRoute);
    this.router.get('/sample-errored-route', this.sampleErroredRoute);
  }
}
