import { TestingApp, getApp } from 'test/lib';
import { ProjectMemberRole } from 'src/project/schemas/project-member.schema';

describe('ResourceController (e2e)', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await getApp()
  });

  afterEach(async () => {
    await app.close();
  })

  it('create resource by admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })

    const { name, slug } = app.Resource.make()
    const response = await app.net.post(`/resource`, session).send({ project: project.id, name, slug })
    expect(response.status).toBe(201)

    const result = response.body
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name', name)
    expect(result).toHaveProperty('slug', slug)
  });

  it('create resource with the same name and slug of another project', async () => {
    const name = 'name'
    const slug = 'slug'

    {
      const project = await app.Project.create()
      await app.Resource.create({ project, name, slug })
    }
    
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })

    const response = await app.net.post(`/resource`, session).send({ project: project.id, name, slug })
    expect(response.status).toBe(201)
  });

  it('create resource by developer', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })

    const { name, slug } = app.Resource.make()
    const response = await app.net.post(`/resource`, session).send({ project: project.id, name, slug })
    expect(response.status).toBe(201)
  });

  it('create resource by tester', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Tester })

    const { name, slug } = app.Resource.make()
    const response = await app.net.post(`/resource`, session).send({ project: project.id, name, slug })
    expect(response.status).toBe(403)
  });

  it('create resource by not member', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()

    const { name, slug } = app.Resource.make()
    const response = await app.net.post(`/resource`, session).send({ project: project.id, name, slug })
    expect(response.status).toBe(403)
  });

  it('create resource with repeated name', async () => {
    const { name, slug } = app.Resource.make()
    const project = await app.Project.create()
    await app.Resource.create({ project, name })

    const session = await app.User.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })

    const response = await app.net.post(`/resource`, session).send({ project: project.id, name, slug })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('name', 'Existed')
  });

  it('create resource with repeated slug', async () => {
    const { name, slug } = app.Resource.make()
    const project = await app.Project.create()
    await app.Resource.create({ project, slug })

    const session = await app.User.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })

    const response = await app.net.post(`/resource`, session).send({ project: project.id, name, slug })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('slug', 'Existed')
  });

  it('delete resource by admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })

    const resource = await app.Resource.create({ project })
    const response = await app.net.delete(`/resource/${resource.id}`, session)
    expect(response.status).toBe(200)
    expect(await app.Resource.model.countDocuments({ _id: resource.id })).toBe(0)
  })

  it('delete resource by developer', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Developer })

    const resource = await app.Resource.create({ project })
    const response = await app.net.delete(`/resource/${resource.id}`, session)
    expect(response.status).toBe(200)
  })

  it('delete resource by tester', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Tester })

    const resource = await app.Resource.create({ project })
    const response = await app.net.delete(`/resource/${resource.id}`, session)
    expect(response.status).toBe(403)
  })

  it('delete resource by other user', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()

    const resource = await app.Resource.create({ project })
    const response = await app.net.delete(`/resource/${resource.id}`, session)
    expect(response.status).toBe(403)
  })

  it('update resource by admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })

    const resource = await app.Resource.create({ project })
    const name = resource.name //'new name'
    const slug = 'new-slug'
    const response = await app.net.patch(`/resource/${resource.id}`, session).send({ name, slug })

    expect(response.status).toBe(200)
    expect(await app.Resource.model.countDocuments({ _id: resource.id, name, slug })).toBe(1)
  })

  it('update resource with repeated name', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })

    const name = 'name'
    await app.Resource.create({ project, name })

    const resource = await app.Resource.create({ project })
    const response = await app.net.patch(`/resource/${resource.id}`, session).send({ name })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('name', 'Existed')
  })

  it('update resource with repeated slug', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })

    const slug = 'slug'
    await app.Resource.create({ project, slug })

    const resource = await app.Resource.create({ project })
    const response = await app.net.patch(`/resource/${resource.id}`, session).send({ slug })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('slug', 'Existed')
  })

  it('list resource by admin', async () => {
    const size = 20
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })
    await app.Resource.createMany(size, { project })
    await app.Resource.createMany(size)
    
    const response = await app.net.get(`/resource`, session).query({ project: project.id })
    expect(response.status).toBe(200)

    const result = response.body
    expect(result.pagination.total).toBe(size)
  })

  it('read resource by admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })

    const resource = await app.Resource.create({ project })    
    const response = await app.net.get(`/resource/${resource.id}`, session)
    expect(response.status).toBe(200)

    const result = response.body
    expect(result.id).toBe(resource.id)
  })

  it('read resource by other user', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()

    const resource = await app.Resource.create({ project })    
    const response = await app.net.get(`/resource/${resource.id}`, session)
    expect(response.status).toBe(403)
  })
});
