import { Server } from 'http';
import express from 'express';
import { responseErrorHandler } from 'express-response-errors';
import getPort, { portNumbers } from 'get-port';
import request from 'supertest';

import { Request } from '../../src/common-types/gql';
import { User } from '../../src/controllers/Auth/middleware';

type InitProps = {
  withRouter?: express.Router;
};

class App {
  server: express.Application;
  request: request.SuperTest<request.Test>;
  private _server: Server;
  authedUser: User | null = null;

  constructor() {
    const app = express();
    this.server = app;
  }

  async initialize({ withRouter }: InitProps = {}) {
    this.server.use(express.json());
    this.server.use(express.static('public'));

    if (withRouter) {
      this.server.use(withRouter);
    }

    this.server.use((req: Request, _, next) => {
      req.user = this.authedUser || undefined;
      next();
    });

    this.server.use(responseErrorHandler);

    const server = this.server.listen(
      await getPort({ port: portNumbers(9000, 10000) }),
    );

    this._server = server;
    this.request = request(this.server);
  }

  destroy() {
    this._server.close();
  }

  login(user: User) {
    this.authedUser = user;
  }

  logout() {
    this.authedUser = null;
  }
}

export default App;
