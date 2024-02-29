import { TestingApp, getApp } from 'test/lib';

describe('EntityFieldController (e2e)', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await getApp()
  });

  afterEach(async () => {
    await app.close();
  })

  it('/entity (POST)', async () => {
    const project = await app.ProjectModel.create({})
    expect(project).toHaveProperty('_id');
  });

});
