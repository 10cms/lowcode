import { ForbiddenException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ProjectMemberRole } from 'src/project/schemas/project-member.schema';
import { ProjectDocument } from 'src/project/schemas/project.schema';
import { ProjectMemberService } from 'src/project/services/project-member/project-member.service';
import { ResourceDocument } from 'src/resource/schemas/resource.schema';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class ResourceAbilityService {
  constructor(
    private readonly i18n: I18nService,
    private readonly projectMemberService: ProjectMemberService
  ) {}

  async canEditResource(user: UserDocument, project: ProjectDocument) {
    const relation = await this.projectMemberService.getRelation(project, user)
    return relation && [ProjectMemberRole.Admin, ProjectMemberRole.Developer].includes(relation.role)
  }

  async canCreateResource(user: UserDocument, project: ProjectDocument) {
    return await this.canEditResource(user, project)
  }

  async canCreateResourceOrFail(user: UserDocument, project: ProjectDocument) {
    if (! await this.canCreateResource(user, project)) {
      throw new ForbiddenException(this.i18n.t('permission.resource.create'))
    }

    return true
  }

  async canDeleteResource(user: UserDocument, resource: ResourceDocument) {
    return await this.canEditResource(user, resource.project)
  }

  async canDeleteResourceOrFail(user: UserDocument, resource: ResourceDocument) {
    if (! await this.canDeleteResource(user, resource)) {
      throw new ForbiddenException(this.i18n.t('permission.resource.delete'))
    }

    return true
  }

  async canUpdateResource(user: UserDocument, resource: ResourceDocument) {
    return await this.canEditResource(user, resource.project)
  }

  async canUpdateResourceOrFail(user: UserDocument, resource: ResourceDocument) {
    if (! await this.canUpdateResource(user, resource)) {
      throw new ForbiddenException(this.i18n.t('permission.resource.update'))
    }

    return true
  }

  async canReadResource(user: UserDocument, project: ProjectDocument | string) {
    return !! await this.projectMemberService.getRelation(project, user)
  }

  async canReadResourceOrFail(user: UserDocument, project: ProjectDocument | string) {
    if (! await this.canReadResource(user, project)) {
      throw new ForbiddenException(this.i18n.t('permission.resource.read'))
    }

    return true
  }
}
