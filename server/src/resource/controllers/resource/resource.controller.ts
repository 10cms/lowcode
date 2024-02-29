import { CollectionDto } from '@forlagshuset/nestjs-mongoose-paginate';
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Session } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ParseProjectByIdPipe } from 'src/project/pipes/parse-project-by-id.pipe';
import { ProjectDocument } from 'src/project/schemas/project.schema';
import { CreateResourceDto, CreateResourcePipe } from 'src/resource/pipes/create-resource.pipe';
import { ListResourcePipe } from 'src/resource/pipes/list-resource.pipe';
import { ParseResourceByIdPipe } from 'src/resource/pipes/parse-resource-by-id.pipe';
import { UpdateResourcePipe, UpdateResourceDto } from 'src/resource/pipes/update-resource.pipe';
import { Resource, ResourceDocument } from 'src/resource/schemas/resource.schema';
import { ResourceAbilityService } from 'src/resource/services/resource-ability/resource-ability.service';
import { ResourceService } from 'src/resource/services/resource/resource.service';
import { UserDocument } from 'src/user/schemas/user.schema';

@Controller()
export class ResourceController {
  constructor(
    private readonly i18n: I18nService,
    private readonly resourceService: ResourceService,
    private readonly resourceAbilityService: ResourceAbilityService
  ) {}

  @Post('/resource')
  async createResource(
    @Session() session: UserDocument,
    @Body(CreateResourcePipe) data: CreateResourceDto & { project: ProjectDocument }
  ) {
    await this.resourceAbilityService.canCreateResourceOrFail(session, data.project)

    const { project, name, slug } = data
    if (await this.resourceService.resourceModel.exists({ project, name })) {
      throw new BadRequestException({ name: this.i18n.t('validation.existed') })
    }

    if (await this.resourceService.resourceModel.exists({ project, slug })) {
      throw new BadRequestException({ slug: this.i18n.t('validation.existed') })
    }

    const resource = new this.resourceService.resourceModel(data)
    return await resource.save()
  }

  @Delete('/resource/:resourceId')
  async deleteResource(
    @Session() session: UserDocument,
    @Param('resourceId', ParseResourceByIdPipe) resource: ResourceDocument
  ) {
    await this.resourceAbilityService.canDeleteResourceOrFail(session, resource)
    await resource.deleteOne()
  }

  @Patch('/resource/:resourceId')
  async updateResource(
    @Session() session: UserDocument,
    @Param('resourceId', ParseResourceByIdPipe) resource: ResourceDocument,
    @Body(UpdateResourcePipe) data: UpdateResourceDto
  ) {
    await this.resourceAbilityService.canUpdateResourceOrFail(session, resource)

    const { name, slug } = data
    if ( name && name !== resource.name &&
      await this.resourceService.resourceModel.exists({ project: resource.project, name: name })  
    ) {
      throw new BadRequestException({ name: this.i18n.t('validation.existed') })
    }

    if ( slug && slug !== resource.slug &&
      await this.resourceService.resourceModel.exists({ project: resource.project, slug: slug })  
    ) {
      throw new BadRequestException({ slug: this.i18n.t('validation.existed') })
    }

    if (name || slug) {
      await resource.updateOne(data)
    }

    return resource
  }

  @Get('/resource')
  async listResource(
    @Session() session: UserDocument,
    @Query('project', ParseProjectByIdPipe) project: ProjectDocument,
    @Query(ListResourcePipe) query: CollectionDto,
  ) {
    await this.resourceAbilityService.canReadResourceOrFail(session, project)
    query.filter!.project = project
    return await this.resourceService.listResource(query)
  }

  @Get('/resource/:resourceId')
  async readResource(
    @Session() session: UserDocument,
    @Param('resourceId', ParseResourceByIdPipe) resource: ResourceDocument
  ) {
    await this.resourceAbilityService.canReadResourceOrFail(session, resource.project)
    return resource
  }
}