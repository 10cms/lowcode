import { CollectionDto, CollectionResponse } from '@forlagshuset/nestjs-mongoose-paginate';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ListQuery } from 'src/lib/list-query';
import { Resource, ResourceDocument, ResourceModel } from 'src/resource/schemas/resource.schema';

@Injectable()
export class ResourceService {
  constructor(
    @InjectModel(Resource.name)
    public readonly resourceModel: ResourceModel
  ) {}

  async listResource(query: CollectionDto): Promise<CollectionResponse<ResourceDocument>> {
    const collector = new ListQuery<ResourceDocument>(this.resourceModel);
    return collector.find(query);
  }
}
