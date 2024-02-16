import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEntityDto } from 'src/dto/create-entity.dto';
import { Entity, EntityDocument } from 'src/schemas/entity.schema';

@Injectable()
export class EntityService {
  constructor(@InjectModel(Entity.name) private entityModel: Model<Entity>) {}

  async createEntity(createEntityDto: CreateEntityDto): Promise<EntityDocument> {
    const entity = new this.entityModel(createEntityDto);
    await entity.save();
    return entity
  }

  async findAll(): Promise<Entity[]> {
    return this.entityModel.find().exec();
  }
}
