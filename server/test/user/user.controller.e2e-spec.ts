import { TestingApp, getApp } from 'test/lib';

describe('UserController (e2e)', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await getApp()
  });

  afterEach(async () => {
    await app.close();
  })

  it('user profile', async () => {
    const user = await app.User.create()
    const response = await app.net.get('/user/profile', user)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', user.id)
  });

});
