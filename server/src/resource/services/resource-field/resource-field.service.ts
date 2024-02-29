import { CollectionDto, CollectionResponse } from '@forlagshuset/nestjs-mongoose-paginate';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ListQuery } from 'src/lib/list-query';
import { ResourceField, ResourceFieldDocument, ResourceFieldModel } from 'src/resource/schemas/resource-field.schema';

@Injectable()
export class ResourceFieldService {
  constructor(
    @InjectModel(ResourceField.name)
    public readonly resourceFieldModel: ResourceFieldModel
  ) {}

  async listResourceField(query: CollectionDto): Promise<CollectionResponse<ResourceFieldDocument>> {
    const collector = new ListQuery<ResourceFieldDocument>(this.resourceFieldModel);
    return collector.find(query);
  }
}
