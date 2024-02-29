import { Module } from '@nestjs/common';
import { ResourceController } from './controllers/resource/resource.controller';
import { ResourceService } from './services/resource/resource.service';
import { ResourceFieldService } from './services/resource-field/resource-field.service';
import { ResourceFieldController } from './controllers/resource-field/resource-field.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceField, ResourceFieldSchema } from './schemas/resource-field.schema';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { ProjectModule } from 'src/project/project.module';
import { ResourceAbilityService } from './services/resource-ability/resource-ability.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
      { name: ResourceField.name, schema: ResourceFieldSchema }
    ]),
    ProjectModule
  ],
  controllers: [ResourceController, ResourceFieldController],
  providers: [ResourceService, ResourceFieldService, ResourceAbilityService]
})
export class ResourceModule {}
