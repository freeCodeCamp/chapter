import express from 'express';
import getPort from 'get-port';
import request from 'supertest';
import { responseErrorHandler } from 'express-response-errors';
import { Server } from 'http';
import { User } from 'server/models';
import { Request } from 'server/ts/gql';

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
      await getPort({ port: getPort.makeRange(9000, 10000) }),
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
