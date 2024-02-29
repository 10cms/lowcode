import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectConfig } from 'src/page/schemas/project-config.schema';
import { ProjectDocument } from 'src/project/schemas/project.schema';
import * as fs from 'fs';

const defaultPageSchema = fs.readFileSync('./data/defaultPageSchema.json', { encoding: 'utf-8' })
const defaultPackageSchema = fs.readFileSync('./data/defaultPackageSchema.json', { encoding: 'utf-8' })
const defaultResourceList = JSON.stringify([{"title":"首页","slug":"index","id": "index"}])

@Injectable()
export class ProjectConfigService {
  constructor(
    @InjectModel(ProjectConfig.name) private ProjectConfigModel: Model<ProjectConfig>
  ) {}

  async findBySlug (project: ProjectDocument, slug: string) {
    return await this.ProjectConfigModel.findOne({ project, slug });
  }

  async initProjectConfig (project: ProjectDocument) {
    await this.ProjectConfigModel.create([
      new this.ProjectConfigModel({ project, slug: 'resourceList', value: defaultResourceList }),
      new this.ProjectConfigModel({ project, slug: 'index:packages', value: defaultPackageSchema }),
      new this.ProjectConfigModel({ project, slug: 'index:projectSchema', value: defaultPageSchema }),
    ])
  }

  async deleteAllProjectConfig (project: ProjectDocument) {
    await this.ProjectConfigModel.deleteMany({ project });
  }
}
