import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateProjectDto } from 'src/dto/create-project.dto';
import { DeleteProjectDto } from 'src/dto/delete-project.dto';
import { ProjectConfig } from 'src/schemas/project-config.schema';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { ProjectConfigService } from '../project-config/project-config.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private ProjectModel: Model<Project>,
    private projectConfigService: ProjectConfigService
  ) {}
  
  async findAll(where: FilterQuery<ProjectDocument> = {}): Promise<ProjectDocument[]> {
    return await this.ProjectModel.find(where).sort({ _id: -1 }).exec();
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    const project = new this.ProjectModel(createProjectDto);
    await project.save();
    await this.projectConfigService.initProjectConfig(project);
    return project
  }

  async deleteProject(project: ProjectDocument): Promise<boolean> {
    await this.projectConfigService.deleteAllProjectConfig(project);
    await project.deleteOne();
    return true
  }

  async isSlugExisted(slug: string): Promise<boolean> {
    const project = await this.ProjectModel.findOne({slug});
    return !!project;
  }

  async findOneBySlug(slug: string): Promise<ProjectDocument | null> {
    return await this.ProjectModel.findOne({slug});
  }
}
