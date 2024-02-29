import { CollectionDto } from '@forlagshuset/nestjs-mongoose-paginate';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session } from '@nestjs/common';
import { CreateResourceFieldPipe, CreateResourceFieldDto } from 'src/resource/pipes/create-resource-field.pipe';
import { ListResourceFieldPipe } from 'src/resource/pipes/list-resource-field.pipe';
import { ParseResourceByIdPipe } from 'src/resource/pipes/parse-resource-by-id.pipe';
import { ParseResourceFieldByIdPipe } from 'src/resource/pipes/parse-resource-field-by-id.pipe';
import { UpdateResourceFieldDto, UpdateResourceFieldPipe } from 'src/resource/pipes/update-resource-field.pipe';
import { ResourceFieldDocument } from 'src/resource/schemas/resource-field.schema';
import { ResourceDocument } from 'src/resource/schemas/resource.schema';
import { ResourceAbilityService } from 'src/resource/services/resource-ability/resource-ability.service';
import { ResourceFieldService } from 'src/resource/services/resource-field/resource-field.service';
import { UserDocument } from 'src/user/schemas/user.schema';

@Controller('resource-field')
export class ResourceFieldController {
  constructor(
    private readonly resourceFieldService: ResourceFieldService,
    private readonly resourceAbilityService: ResourceAbilityService
  ) {}

  @Post()
  async createResourceField(
    @Session() session: UserDocument,
    @Body(CreateResourceFieldPipe) data: CreateResourceFieldDto & { resource: ResourceDocument }
  ) {
    await data.resource.populate('project')
    const project = data.resource.project
    await this.resourceAbilityService.canCreateResourceOrFail(session, project);
    return await this.resourceFieldService.resourceFieldModel.create(data);
  }

  @Patch(':resourceFieldId')
  async updateResourceField(
    @Session() session: UserDocument,
    @Param('resourceFieldId', ParseResourceFieldByIdPipe) resourceField: ResourceFieldDocument,
    @Body(UpdateResourceFieldPipe) data: UpdateResourceFieldDto
  ) {
    await resourceField.populate('resource')
    await this.resourceAbilityService.canUpdateResourceOrFail(session, resourceField.resource);
    await resourceField.updateOne(data);
    return resourceField;
  }

  @Delete(':resourceFieldId')
  async deleteResourceField(
    @Session() session: UserDocument,
    @Param('resourceFieldId', ParseResourceFieldByIdPipe) resourceField: ResourceFieldDocument
  ) {
    await resourceField.populate('resource')
    await this.resourceAbilityService.canDeleteResourceOrFail(session, resourceField.resource);
    await resourceField.deleteOne();
  }

  @Get('')
  async listResourceField(
    @Session() session: UserDocument,
    @Query('resource', ParseResourceByIdPipe) resource: ResourceDocument,
    @Query(ListResourceFieldPipe) query: CollectionDto,
  ) {
    await this.resourceAbilityService.canReadResourceOrFail(session, resource.project)
    query.filter!.resource = resource
    return await this.resourceFieldService.listResourceField(query)
  }
}
