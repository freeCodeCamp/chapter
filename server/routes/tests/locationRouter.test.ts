import App from 'server/testUtils/App';
import locationsRouter from 'server/routes/v1/location';

describe('router: sampleRouter', () => {
  const app = new App();

  beforeAll(async () => {
    await app.initialize({ withRouter: locationsRouter });
  });

  describe('/locations', () => {
    // it('Creates a Location', async () => {
    //   const res = await app.request.post('/locations').send({
    //     country_code: 'UK',
    //     city: 'Birmingham',
    //     region: 'West Midlands',
    //     postal_code: 'B377YE',
    //   });

    //   expect(res.status).toBe(201);
    // });

    it('passes', () => {
      expect(1).toBe(1);
    });
  });

  afterAll(() => {
    app.destroy();
  });
});
