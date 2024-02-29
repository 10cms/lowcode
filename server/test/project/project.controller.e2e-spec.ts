import { TestingApp, getApp } from 'test/lib';
import { ObjectId } from 'mongodb';
import { ProjectMemberRole } from 'src/project/schemas/project-member.schema';

describe('ProjectController (e2e)', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await getApp()
  });

  afterEach(async () => {
    await app.close();
  })

  it('create project', async () => {
    const session = await app.User.create()
    const project = app.Project.make()
    const response = await app.net.post('/project', session).send(project)
    
    expect(response.status).toBe(201)

    const result = response.body
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name', project.name)
    expect(result).toHaveProperty('createdAt')

    const projectMemberExists = !! await app.ProjectMember.model.findOne({
      project: result.id,
      user: session,
      role: ProjectMemberRole.Admin
    })

    expect(projectMemberExists).toBe(true)
  });

  it('delete project by admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.service.create(project, session, ProjectMemberRole.Admin)

    const response = await app.net.delete(`/project/${project.id}`, session)
    expect(response.status).toBe(200)

    const result = response.body
    expect(result).toHaveProperty('id', project.id)

    expect(await app.Project.model.countDocuments({ _id: project.id })).toBe(0) 
    expect(await app.Project.model.countDocumentsDeleted({ _id: project.id })).toBe(1) 
  })

  it('delete project by not admin', async () => {
    const project = await app.Project.create()
    const session = await app.User.create()
    await app.ProjectMember.service.create(project, session, ProjectMemberRole.Tester)

    const response = await app.net.delete(`/project/${project.id}`, session)
    expect(response.status).toBe(403)
  })

  it('delete project by not member', async () => {
    const project = await app.Project.create()
    const session = await app.User.create()

    const response = await app.net.delete(`/project/${project.id}`, session)
    expect(response.status).toBe(403)
  })

  it('delete not exist project', async () => {
    const session = await app.User.create()
    const response = await app.net.delete(`/project/${new ObjectId}`, session)
    expect(response.status).toBe(404)
  })

  it('get project by member', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.service.create(project, session, ProjectMemberRole.Tester)
    const response = await app.net.get(`/project/${project.id}`, session)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', project.id)
  })

  it('get project by not member', async () => {
    const project = await app.Project.create()
    const session = await app.User.create()
    const response = await app.net.get(`/project/${project.id}`, session)
    expect(response.status).toBe(403)
  })

  it('get not exist project', async () => {
    const session = await app.User.create()
    const response = await app.net.get(`/project/${new ObjectId}`, session)
    expect(response.status).toBe(404)
  })

  it('update project by admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.service.create(project, session, ProjectMemberRole.Admin)

    const name = 'new name'
    const response = await app.net.patch(`/project/${project.id}`, session).send({ name })
    expect(response.status).toBe(200)

    const result = response.body
    expect(result).toHaveProperty('name', name)
  })

  it('update project by not admin', async () => {
    const project = await app.Project.create()
    const session = await app.User.create()
    await app.ProjectMember.service.create(project, session, ProjectMemberRole.Tester)

    const name = 'new name'
    const response = await app.net.patch(`/project/${project.id}`, session).send({ name })
    expect(response.status).toBe(403)
  })

  it('update project by not member', async () => {
    const project = await app.Project.create()
    const session = await app.User.create()

    const name = 'new name'
    const response = await app.net.patch(`/project/${project.id}`, session).send({ name })
    expect(response.status).toBe(403)
  })

  it('list project without filter', async () => {
    const session = await app.User.create();

    const size = 21;

    // projects user not joined
    await app.Project.createMany(size);

    // projects user joined
    const projects = await app.Project.createMany(size);
    await Promise.all(projects.map(project => app.ProjectMember.service.create(project, session, ProjectMemberRole.Tester)))

    const requestFirstPage = async () => {
      const response = await app.net.get('/project', session).query({ limit: 20 })
      expect(response.status).toBe(200)
  
      const result = response.body
      expect(result.data.length).toBe(20)
      expect(result.pagination.total).toBe(size)
    }

    await requestFirstPage()

    const requestSecondPage = async () => {
      const response = await app.net.get('/project', session).query({ page: 2, limit: 20 })
      expect(response.status).toBe(200)
  
      const result = response.body
      expect(result.data.length).toBe(1)
      expect(result.pagination.total).toBe(size)
    }

    await requestSecondPage()
  })

  it('list project with name filter', async () => {
    // projects user not joined
    await app.Project.createMany(20);

    const name = 'test'
    const session = await app.User.create();
    const project = await app.Project.create({ name });
    await app.ProjectMember.service.create(project, session, ProjectMemberRole.Tester)

    const filter = { name: { $eq: name } }
    const response = await app.net.get('/project', session).query({ filter })
    expect(response.status).toBe(200)

    const result = response.body
    expect(result.data.length).toBe(1)
    expect(result.pagination.total).toBe(1)
  })
});
