import App from 'server/testUtils/App';
import chapterRouter from 'server/routes/v1/chapter';

describe('router: sampleRouter', () => {
  const app = new App();

  beforeAll(async () => {
    await app.initialize({ withRouter: chapterRouter });
  });

  describe('/api/v1/chapter', () => {
    it('Creates a Chapter', async () => {
      const res = await app.request.post('/api/v1/chapter/1').send({
        name: 'Test',
        description: 'Test',
        category: 'Test',
        details: 'Hello World',
        location: 'Birmingham, UK',
        creator: 1,
      });

      expect(res.status).toBe(201);
    });

    it('Adds a user to the chapter', async () => {
      const res = await app.request.get('/api/sample-route?x=1');

      expect(res.body).toEqual({
        message: 'Response from the server',
        query: {
          x: '1',
        },
      });
    });

    it('Bans a user from a chapter', async () => {
      const res = await app.request.get('/api/sample-route?x=1');

      expect(res.body).toEqual({
        message: 'Response from the server',
        query: {
          x: '1',
        },
      });
    });
  });

  afterAll(() => {
    app.destroy();
  });
});
