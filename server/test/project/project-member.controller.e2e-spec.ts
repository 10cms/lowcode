import { ProjectMemberRole } from 'src/project/schemas/project-member.schema';
import { TestingApp, getApp } from 'test/lib';
import { ObjectId } from 'mongodb';

describe('ProjectMemberController (e2e)', () => {
  let app: TestingApp;

  beforeEach(async () => {
    app = await getApp()
  });

  afterEach(async () => {
    await app.close();
  })

  it('create project member by admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })
    
    const role = ProjectMemberRole.Tester
    const user = await app.User.create()

    const response = await app.net.post(`/project/${project.id}/member`, session).send({ role, user: user.id })
    expect(response.status).toBe(201)

    const projectMemberExists = !! await app.ProjectMember.model.findOne({
      project,
      user,
      role
    })

    expect(projectMemberExists).toBe(true)
  });

  it('create project member by not admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()

    const role = ProjectMemberRole.Tester
    const user = await app.User.create()
    const response = await app.net.post(`/project/${project.id}/member`, session).send({ role, user: user.id })
    expect(response.status).toBe(403)
  });

  it('create project member repeated', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })

    const role = ProjectMemberRole.Tester
    const user = await app.User.create()
    await app.net.post(`/project/${project.id}/member`, session).send({ role, user })

    const response = await app.net.post(`/project/${project.id}/member`, session).send({ role, user })
    expect(response.status).toBe(400)
  });

  it('create project member with not exist user', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })

    const role = ProjectMemberRole.Tester
    const response = await app.net.post(`/project/${project.id}/member`, session).send({ role, user: new ObjectId() })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('user', 'Not exist')
  });

  it('remove project member by admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Admin })
    
    const user = await app.User.create()
    await app.ProjectMember.create({ project, user, role: ProjectMemberRole.Tester })

    const response = await app.net.delete(`/project/${project.id}/member/${user.id}`, session)
    expect(response.status).toBe(200)

    const exists = !! await app.ProjectMember.model.exists({ project, user })
    expect(exists).toBe(false)
  });

  it('remove project member by not admin', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Tester })
    
    const user = await app.User.create()
    await app.ProjectMember.create({ project, user, role: ProjectMemberRole.Tester })

    const response = await app.net.delete(`/project/${project.id}/member/${user.id}`, session)
    expect(response.status).toBe(403)
  });

  it('remove project member by member self', async () => {
    const session = await app.User.create()
    const project = await app.Project.create()
    await app.ProjectMember.create({ project, user: session, role: ProjectMemberRole.Tester })

    const response = await app.net.delete(`/project/${project.id}/member/${session.id}`, session)
    expect(response.status).toBe(200)
  });

});
