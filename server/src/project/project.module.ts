import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectService } from './services/project/project.service';
import { ProjectController } from './controllers/project/project.controller';
import { ProjectMemberService } from './services/project-member/project-member.service';
import { ProjectMemberController } from './controllers/project-member/project-member.controller';
import { projectMemberFeatury } from './schemas/project-member.schema';
import { projectFeatury } from './schemas/project.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      projectFeatury,
      projectMemberFeatury
    ]),
  ],
  providers: [
    ProjectService,
    ProjectMemberService
  ],
  controllers: [
    ProjectController,
    ProjectMemberController
  ],
  exports: [
    ProjectService,
    ProjectMemberService
  ]
})
export class ProjectModule {}
