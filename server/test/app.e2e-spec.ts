import { TestingApp, getApp } from './lib';

describe('AppController (e2e)', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await getApp()
  });

  afterEach(async () => {
    await app.close();
  })

  it('/ (GET)', () => {
    return app.net.get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
