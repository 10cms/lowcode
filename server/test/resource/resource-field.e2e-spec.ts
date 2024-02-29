import { TestingApp, getApp } from 'test/lib';
import { ProjectMemberRole } from 'src/project/schemas/project-member.schema';

describe('Resource Field', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await getApp()
  });

  afterEach(async () => {
    await app.close();
  })

  it('create resource field by project admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })
    const resource = await app.Resource.create({ project })

    const input = app.ResourceField.make({ resource: resource.id })
    const response = await app.net.post(`/resource-field`, session).send(input)
    expect(response.status).toBe(201)

    const result = response.body
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name', input.name)
    expect(result).toHaveProperty('slug', input.slug)
    expect(result).toHaveProperty('type', input.type)
  });

  it('create resource field by project developer', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })
    const resource = await app.Resource.create({ project })

    const input = app.ResourceField.make({ resource: resource.id })
    const response = await app.net.post(`/resource-field`, session).send(input)
    expect(response.status).toBe(201)
  });

  it('create resource field by project tester', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Tester })
    const resource = await app.Resource.create({ project })

    const input = app.ResourceField.make({ resource: resource.id })
    const response = await app.net.post(`/resource-field`, session).send(input)
    expect(response.status).toBe(403)
  });

  it('create resource field by not project member', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    const resource = await app.Resource.create({ project })

    const input = app.ResourceField.make({ resource: resource.id })
    const response = await app.net.post(`/resource-field`, session).send(input)
    expect(response.status).toBe(403)
  })

  it('update resource field successfully', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })
    const resource = await app.Resource.create({ project })
    const resourceField = await app.ResourceField.create({ resource })

    const name = 'new name'
    const response = await app.net.patch(`/resource-field/${resourceField.id}`, session).send({ name })
    expect(response.status).toBe(200)

    const result = response.body
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name', resourceField.name)
  });

  it('delete resource field successfully', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })
    const resource = await app.Resource.create({ project })
    const resourceField = await app.ResourceField.create({ resource })

    const response = await app.net.delete(`/resource-field/${resourceField.id}`, session)
    expect(response.status).toBe(200)

    const count = await app.ResourceField.model.countDocuments({ _id: resourceField.id })
    expect(count).toBe(0)
  })

  it('list resource field successfully', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })
    const resource = await app.Resource.create({ project })

    const size = 10
    await app.ResourceField.createMany(size, { resource })

    const response = await app.net.get(`/resource-field`, session).query({ resource: resource.id })
    expect(response.status).toBe(200)

    const result = response.body
    expect(result.pagination.total).toBe(size)
  })
});
