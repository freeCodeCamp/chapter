import App from 'server/testUtils/App';
import chapterRouter from 'server/routes/v1/chapter';
import { User } from 'server/models';

describe('router: sampleRouter', () => {
  const app = new App();

  beforeAll(async () => {
    await app.initialize({ withRouter: chapterRouter });
  });

  describe('/chapter', () => {
    it('Creates a Chapter', async () => {
      const locations = await app.request.get('/locations');

      const user = await app.request.post('/user').send({
        first_name: 'Test',
        last_name: 'Agent',
        email: 'example@freecodecamp.com',
      });

      const res = await app.request.post('/chapters').send({
        name: 'Test',
        description: 'Test',
        category: 'Test',
        details: 'Hello World',
        location: locations[0].id,
        creator: user.id,
      });

      expect(res.error).toBe(undefined);
      expect(res.body).toStrictEqual({
        name: 'Test',
        description: 'Test',
        category: 'Test',
        details: 'Hello World',
        creator: 1,
      });
      expect(res.status).toBe(201);
    });

    it('Adds a user to the chapter', async () => {
      const res = await app.request.get('/chapters/1/join/1');

      expect(res.status).toBe(201);
    });

    it('Bans a user from a chapter', async () => {
      const res = await app.request.get('/chapters/1/ban/1');

      expect(res.status).toBe(201);
    });
  });

  afterAll(() => {
    app.destroy();
  });
});
