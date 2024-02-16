import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateProjectDto, CreateProjectSchema } from 'src/dto/create-project.dto';
import { DeleteProjectDto, DeleteProjectSchema } from 'src/dto/delete-project.dto';
import { AjvValidationPipe } from 'src/pipes/ajv-validation.pipe';
import { ProjectDocument } from 'src/schemas/project.schema';
import { ProjectConfigService } from 'src/services/project-config/project-config.service';
import { ProjectService } from 'src/services/project/project.service';

@Controller('project')
export class ProjectController {
  constructor (
    private projectService: ProjectService,
    private projectConfigService: ProjectConfigService
  ) {}

  @Get()
  async findAll() {
    const where: FilterQuery<ProjectDocument> = {};

    if (process.env.IS_PROD) {
      where.slug = {
        $ne: 'admin'
      }
    }
    
    return await this.projectService.findAll(where);
  }

  @Post()
  @UsePipes(new AjvValidationPipe(CreateProjectSchema))
  async create(@Body() createProjectDto: CreateProjectDto) {
    const isSlugExisted = await this.projectService.isSlugExisted(createProjectDto.slug);
    if (isSlugExisted) {
      return {
        success: false,
        errors: {
          slug: '已存在'
        }
      }
    }

    const project = await this.projectService.createProject(createProjectDto);
    return {
      success: true,
      project
    }
  }

  @Delete()
  @UsePipes(new AjvValidationPipe(DeleteProjectSchema))
  async delete(@Body() deleteProjectDto: DeleteProjectDto) {
    const project = await this.projectService.findOneBySlug(deleteProjectDto.slug);
    if (! project) {
      throw new NotFoundException('Project not found');
    }

    const result = await this.projectService.deleteProject(project);
    return {
      success: result
    }
  }

  @Get(':projectSlug/config/:configSlug')
  async getConfig(
    @Param('projectSlug') projectSlug: string,
    @Param('configSlug') configSlug: string
  ) {
    const project = await this.projectService.findOneBySlug(projectSlug);
    if (! project) {
      throw new NotFoundException('Project not found');
    }

    return await this.projectConfigService.getProjectConfig(project, configSlug);
  }

  @Put(':projectSlug/config/:configSlug')
  async updateConfig(
    @Param('projectSlug') projectSlug: string,
    @Param('configSlug') configSlug: string,
    @Body() input: any
  ) {
    const project = await this.projectService.findOneBySlug(projectSlug);
    if (! project) {
      throw new NotFoundException('Project not found');
    }

    return await this.projectConfigService.setProjectConfig(project, configSlug, input.value);
  }
}
