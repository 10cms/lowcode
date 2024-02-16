import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityService } from './services/entity/entity.service';
import { EntityFieldService } from './services/entity-field/entity-field.service';
import { EntityField, EntityFieldSchema } from './schemas/entity-field.schema';
import { Entity, EntitySchema } from './schemas/entity.schema';
import { EntityController } from './controllers/entity/entity.controller';
import { ProjectController } from './controllers/project/project.controller';
import { ProjectConfigService } from './services/project-config/project-config.service';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectConfig, ProjectConfigSchema } from './schemas/project-config.schema';
import { ProjectService } from './services/project/project.service';
import { SeedCommand } from './commands/seed.command';
import { AccountController } from './controllers/account/account.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@mongo:27017'),
    MongooseModule.forFeature([
      { name: Entity.name, schema: EntitySchema },
      { name: EntityField.name, schema: EntityFieldSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectConfig.name, schema: ProjectConfigSchema }
    ])
  ],
  controllers: [AppController, EntityController, ProjectController, AccountController],
  providers: [
    AppService, EntityService, EntityFieldService, ProjectConfigService, ProjectService,
    SeedCommand
  ],
})
export class AppModule {}
