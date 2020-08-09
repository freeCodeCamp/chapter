import express from 'express';
import next from 'next';
import { join } from 'path';

import { main } from './app';

const PORT = parseInt(process.env.PORT || '', 10) || 5000;
const app = next({ dev: false, dir: join(__dirname, '../client') });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();
  await main(server);

  server.all('*', (req, res) => handle(req, res));

  server.listen(PORT, () => console.log(`> Ready on http://localhost:${PORT}`));
})();
