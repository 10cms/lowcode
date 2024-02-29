import { Mocker, factory } from "fakingoose";
import { faker } from '@faker-js/faker';
import { ProjectDocument } from "src/project/schemas/project.schema";
import { UserDocument } from "src/user/schemas/user.schema";
import { GenericObject } from "fakingoose/dist/types";
import { ProjectMemberDocument, ProjectMemberRole } from "src/project/schemas/project-member.schema";
import { ResourceDocument } from "src/resource/schemas/resource.schema";
import { ResourceFieldDocument } from "src/resource/schemas/resource-field.schema";
import { Model } from "mongoose";

export type FactoryCreator<T extends GenericObject> = (model: Model<T>) => Mocker<T>;

const createFactory = <Doc extends GenericObject> (model: Model<Doc>, options: any) => {
  return factory<Doc>(model, {
    id: {
      skip: true
    },
    _id: {
      skip: true
    },
    __v: {
      skip: true
    },
    ...options
  })
}

let cursor = 0
let phone = 10000000000
export const createUserFactory = model => createFactory<UserDocument>(model, {
  phone: {
    value: () => phone++
  }
})

export const createProjectFactory = model => createFactory<ProjectDocument>(model, {
  name: {
    value: () => faker.lorem.word()
  },
  deleted: {
    skip: true
  },
  deletedAt: {
    skip: true
  },
  deletedBy: {
    skip: true
  }
})

export const createProjectMemberFactory = model => createFactory<ProjectMemberDocument>(model, {
  role: {
    value: () => ProjectMemberRole.Tester
  }
})

export const createResourceFactory = model => createFactory<ResourceDocument>(model, {
  name: {
    value: () => faker.lorem.word() + ++cursor
  },
  slug: {
    value: () => faker.lorem.slug() + ++cursor
  }
})

export const createResourceFieldFactory = model => createFactory<ResourceFieldDocument>(model, {
  name: {
    value: () => faker.lorem.word() + ++cursor
  },
  slug: {
    value: () => faker.lorem.slug() + ++cursor
  },
  type: {
    value: () => 'string'
  }
})