import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { ProjectDocument } from './project.schema';

export enum ProjectMemberRole {
  Admin = 'Admin',
  Developer = 'Developer',  
  Tester = 'Tester',
}

@Schema()
export class ProjectMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true })
  project: ProjectDocument

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: UserDocument;

  @Prop({ type: String, required: true })
  role: ProjectMemberRole;
}

export type ProjectMemberDocument = mongoose.HydratedDocument<ProjectMember>;
export type ProjectMemberModel = mongoose.Model<ProjectMemberDocument>;

export const projectMemberFeatury = {
  name: ProjectMember.name,
  useFactory: () => {
    const schema = SchemaFactory.createForClass(ProjectMember);
    schema.index({ project: 1, user: 1 }, { unique: true });
    return schema
  },
  inject: [],
}