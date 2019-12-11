import App from 'server/testUtils/App';
import exampleRouter from 'server/routes/exampleRoutes/exampleRouter';

describe('router: sampleRouter', () => {
  const app = new App();

  beforeAll(async () => {
    await app.initialize({ withRouter: exampleRouter });
  });

  describe('/api/sample-route', () => {
    it('returns a simple response', async () => {
      const res = await app.request.get('/api/sample-route');

      expect(res.body).toEqual({
        message: 'Response from the server',
        query: {},
      });
    });

    it('returns a response with a query', async () => {
      const res = await app.request.get('/api/sample-route?x=1');

      expect(res.body).toEqual({
        message: 'Response from the server',
        query: {
          x: '1',
        },
      });
    });
  });

  describe('/api/sample-async', () => {
    it('returns a simple delayed response', async () => {
      const timerStart = Date.now();
      const res = await app.request.get('/api/sample-async-route');
      const timerEnd = Date.now();

      expect(res.body).toEqual({
        message: 'Delayed response from the server',
        query: {},
      });

      expect(timerEnd - timerStart).toBeGreaterThan(3000);
    });

    it('returns a simple delayed response with query', async () => {
      const timerStart = Date.now();
      const res = await app.request.get('/api/sample-async-route?x=2&y=a');
      const timerEnd = Date.now();

      expect(res.body).toEqual({
        message: 'Delayed response from the server',
        query: {
          x: '2',
          y: 'a',
        },
      });

      expect(timerEnd - timerStart).toBeGreaterThan(3000);
    });
  });

  describe('/api/sample-errored-route', () => {
    it('returns a 400 error', async () => {
      await app.request.get('/api/sample-errored-route').expect(400);
    });
  });

  afterAll(() => {
    app.destroy();
  });
});
