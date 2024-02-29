import { ObjectId } from 'mongodb';
import { entityFactory, projectFactory } from 'test/lib/factories';
import { TestingApp, getApp } from 'test/lib';
import { ProjectService } from 'src/project/services/project/project.service';
import { EntityService } from 'temp/services/entity/entity.service';

describe('EntityController (e2e)', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await getApp()
  });

  afterEach(async () => {
    await app.close();
  })

  it('/entity (POST)', async () => {
    const project = await app.get(ProjectService).create(projectFactory.generate())
    const {name, slug} = entityFactory.generate()

    const response = await app
      .request()
      .post('/entity')
      .send({
        name,
        slug,
        projectSlug: project.slug
      })

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', name);
  });

  it('/entity (DELETE)', async () => {
    const project = await app.get(ProjectService).create(projectFactory.generate())
    const entity = await app.EntityModel.create(entityFactory.generate({
      project
    }))

    const response = await app
      .request()
      .delete('/entity')
      .send({
        projectSlug: entity.project.slug,
        slug: entity.slug
      })

    expect(response.status).toBe(200);

    const count = await app.getCollection('entities').countDocuments()
    expect(count).toBe(0);
  });

  it('/entity (PATCH)', async () => {
    const project = await app.get(ProjectService).create(projectFactory.generate())
    const entity = await app.EntityModel.create(entityFactory.generate({
      project
    }))

    const name = "newName"

    const response = await app
      .request()
      .patch('/entity')
      .send({
        projectSlug: entity.project.slug,
        slug: entity.slug,
        name
      })

    expect(response.status).toBe(200);

    const count = await app.getCollection('entities').countDocuments({ name })
    expect(count).toBe(1);
  });

  it('/entity (GET)', async () => {
    const entitySize = 10
    const project = await app.ProjectModel.create(projectFactory.generate())
    await app.EntityModel.create(
      Array.from({length: entitySize}, () => entityFactory.generate({project}))
    )

    const response = await app
      .request()
      .get('/entity')
      .query({
        projectSlug: project.slug
      })

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(entitySize);
  });

  // it('/project/:projectSlug/config/:configSlug (GET) getProjectConfig', async () => {
  //   const { name, slug } = projectFactory.generate()
  //   const projectService = app.get(ProjectService)
  //   const project = await projectService.create({ name, slug })

  //   const response = await app
  //     .request()
  //     .get(`/project/${project.slug}/config/resourceList`)

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('_id')
  // });

  // it('/project/:projectSlug/config/:configSlug (PATCH)', async () => {
  //   const { name, slug } = projectFactory.generate()
  //   const projectService = app.get(ProjectService)
  //   const project = await projectService.create({ name, slug })

  //   const response = await app
  //     .request()
  //     .patch (`/project/${project.slug}/config/resourceList`)
  //     .send({
  //       value: "resourceList"
  //     });

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('value', "resourceList")
  // });

  // it('/project/:projectSlug/config/:configSlug (PATCH)', async () => {
  //   const { name, slug } = projectFactory.generate()
  //   const projectService = app.get(ProjectService)
  //   const project = await projectService.create({ name, slug })

  //   const response = await app
  //     .request()
  //     .patch (`/project/${project.slug}/config/resourceList`)
  //     .send();

  //   expect(response.status).toBe(400);
  //   expect(response.body).toHaveProperty('value', 'required')
  // });

});
