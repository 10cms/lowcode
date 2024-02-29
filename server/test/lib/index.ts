import { INestApplication } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { User, UserDocument, UserModel } from "src/user/schemas/user.schema";
import { createProjectFactory, createProjectMemberFactory, createResourceFactory, createResourceFieldFactory, createUserFactory } from "./factories";
import { UserService } from "src/user/services/user/user.service";
import { Net, injectNet } from "./net";
import { TestingHelper, createTestingHelper } from "./helper";
import { ProjectMemberModel, ProjectMemberDocument, ProjectMember } from "src/project/schemas/project-member.schema";
import { ProjectModel, ProjectDocument, Project } from "src/project/schemas/project.schema";
import { ProjectService } from "src/project/services/project/project.service";
import { ProjectMemberService } from "src/project/services/project-member/project-member.service";
import { ResourceFieldModel, ResourceFieldDocument, ResourceField } from "src/resource/schemas/resource-field.schema";
import { ResourceModel, ResourceDocument, Resource } from "src/resource/schemas/resource.schema";
import { ResourceFieldService } from "src/resource/services/resource-field/resource-field.service";
import { ResourceService } from "src/resource/services/resource/resource.service";

process.env.MONGO_URL = 'mongodb://root:root@mongo:27017/test?authSource=admin'

export type TestingApp = INestApplication & {
  net: Net;
  User: TestingHelper<UserService, UserModel, UserDocument>;
  Project: TestingHelper<ProjectService, ProjectModel, ProjectDocument>;
  ProjectMember: TestingHelper<ProjectMemberService, ProjectMemberModel, ProjectMemberDocument>;
  Resource: TestingHelper<ResourceService, ResourceModel, ResourceDocument>;
  ResourceField: TestingHelper<ResourceFieldService, ResourceFieldModel, ResourceFieldDocument>;
};

export const getApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: TestingApp = moduleFixture.createNestApplication();
  injectNet(app);

  await app.init();

  app.User = createTestingHelper<UserService, UserModel, UserDocument>(
    app.get(UserService),
    app.get(getModelToken(User.name)),
    createUserFactory
  );

  app.Project = createTestingHelper<ProjectService, ProjectModel, ProjectDocument>(
    app.get(ProjectService),
    app.get(getModelToken(Project.name)),
    createProjectFactory
  );

  app.ProjectMember = createTestingHelper<ProjectMemberService, ProjectMemberModel, ProjectMemberDocument>(
    app.get(ProjectMemberService),
    app.get(getModelToken(ProjectMember.name)),
    createProjectMemberFactory
  );

  app.Resource = createTestingHelper<ResourceService, ResourceModel, ResourceDocument>(
    app.get(ResourceService),
    app.get(getModelToken(Resource.name)),
    createResourceFactory
  );

  app.ResourceField = createTestingHelper<ResourceFieldService, ResourceFieldModel, ResourceFieldDocument>(
    app.get(ResourceFieldService),
    app.get(getModelToken(ResourceField.name)),
    createResourceFieldFactory
  );

  await Promise.all([
    app.ResourceField.model.collection.drop(),
    app.Resource.model.collection.drop(),
    app.ProjectMember.model.collection.drop(),
    app.Project.model.collection.drop(),
    app.User.model.collection.drop(),
  ])

  return app
}