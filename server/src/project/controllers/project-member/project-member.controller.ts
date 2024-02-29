import { BadRequestException, Body, Controller, Delete, ForbiddenException, Param, Post, Session } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CreateProjectMemberPipe, CreateProjectMemberDto } from 'src/project/pipes/create-project-member.pipe';
import { ParseProjectByIdPipe } from 'src/project/pipes/parse-project-by-id.pipe';
import { ProjectMemberRole } from 'src/project/schemas/project-member.schema';
import { ProjectDocument } from 'src/project/schemas/project.schema';
import { ProjectMemberService } from 'src/project/services/project-member/project-member.service';
import { ProjectService } from 'src/project/services/project/project.service';
import { ParseUserByIdPipe } from 'src/user/pipes/parse-user-by-id.pipe';
import { UserDocument } from 'src/user/schemas/user.schema';

@Controller('project')
export class ProjectMemberController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMemberService: ProjectMemberService,
    private readonly i18n: I18nService
  ) {}

  @Post(":id/member")
  async createProjectMember (
    @Session() session: UserDocument,
    @Param('id', ParseProjectByIdPipe) project: ProjectDocument,
    @Body(CreateProjectMemberPipe) { user, role }: CreateProjectMemberDto
  ) {
    const isAdmin = await this.projectMemberService.isAdmin(project, session)
    if (!isAdmin) {
      const message = this.i18n.t('permission.projectMember.create')
      throw new ForbiddenException(message)
    }

    const isMember = await this.projectMemberService.isMember(project, user)
    if (isMember) {
      throw new BadRequestException({
        member: this.i18n.t('validation.existed')
      })
    }

    return await this.projectMemberService.create(project, user, role)
  }

  @Delete(":id/member/:memberId")
  async removeProjectMember (
    @Session() session: UserDocument,
    @Param('id', ParseProjectByIdPipe) project: ProjectDocument,
    @Param('memberId', ParseUserByIdPipe) user: UserDocument
  ) {
    const relation = await this.projectMemberService.getRelation(project, session)
    if (! relation || (relation.role !== ProjectMemberRole.Admin && session.id !== user.id)) {
      throw new ForbiddenException(
        this.i18n.t('permission.projectMember.remove')
      )
    }

    await this.projectMemberService.remove(project, user)
  }
}
