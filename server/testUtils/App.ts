import 'module-alias/register';
import express from 'express';
import getPort from 'get-port';
import request from 'supertest';
import { responseErrorHandler } from 'express-response-errors';
import { Server } from 'http';

type InitProps = {
  withRouter?: express.Router;
};

class App {
  server: express.Application;
  request: request.SuperTest<request.Test>;
  private _server: Server;

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
}

export default App;
