import * as express from 'express';

export abstract class Router {
  public router: express.Router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  protected abstract registerRoutes(): void;
}
