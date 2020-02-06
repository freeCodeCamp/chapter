import App from 'server/testUtils/App';
import chapterRouter from 'server/routes/v1/chapter';

describe('router: sampleRouter', () => {
  const app = new App();

  beforeAll(async () => {
    await app.initialize({ withRouter: chapterRouter });
  });

  describe('/locations', () => {
    it('Creates a Location', async () => {
      const res = await app.request.post('/locations').send({
        country_code: 'UK',
        city: 'Birmingham',
        region: 'West Midlands',
        postal_code: 'B377YE',
      });

      expect(res.status).toBe(201);
    });
  });

  afterAll(() => {
    app.destroy();
  });
});
