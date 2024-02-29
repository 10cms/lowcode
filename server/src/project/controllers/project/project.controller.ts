import { CollectionDto } from '@forlagshuset/nestjs-mongoose-paginate';
import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, Session } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CreateProjectDto, CreateProjectPipe } from 'src/project/pipes/create-project.pipe';
import { ListProjectPipe } from 'src/project/pipes/list-project.pipe';
import { ParseProjectByIdPipe } from 'src/project/pipes/parse-project-by-id.pipe';
import { UpdateProjectPipe } from 'src/project/pipes/update-project.pipe';
import { ProjectDocument } from 'src/project/schemas/project.schema';
import { ProjectMemberService } from 'src/project/services/project-member/project-member.service';
import { ProjectService } from 'src/project/services/project/project.service';
import { UserDocument } from 'src/user/schemas/user.schema';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMemberService: ProjectMemberService,
    private readonly i18n: I18nService
  ) {}

  @Post()
  async createProject (
    @Session() session: UserDocument,
    @Body(CreateProjectPipe) data: CreateProjectDto
  ) {
    return await this.projectService.create(data, session)
  }

  @Delete(':id')
  async deleteProject (
    @Session() session: UserDocument,
    @Param('id', ParseProjectByIdPipe) project: ProjectDocument
  ) {
    if (! await this.projectMemberService.isAdmin(project, session)) {
      throw new ForbiddenException(this.i18n.t('permission.project.delete'))
    }

    await project.delete(session.id)
    return project
  }

  @Get(':id')
  async getProject (
    @Session() session: UserDocument,
    @Param('id', ParseProjectByIdPipe) project: ProjectDocument
  ) {
    if (! await this.projectMemberService.isMember(project, session)) {
      throw new ForbiddenException(this.i18n.t('permission.project.get'))
    }

    return project
  }

  @Get()
  async listProject (
    @Session() session: UserDocument,
    @Query(ListProjectPipe) query: CollectionDto,
  ) {
    return await this.projectService.list(query, session)
  }

  @Patch(':id')
  async updateProject (
    @Session() session: UserDocument,
    @Param('id', ParseProjectByIdPipe) project: ProjectDocument,
    @Body(UpdateProjectPipe) data: Partial<ProjectDocument>
  ) {
    if (! await this.projectMemberService.isAdmin(project, session)) {
      throw new ForbiddenException(this.i18n.t('permission.project.update'))
    }

    return await project.set(data).save()
  }
}
