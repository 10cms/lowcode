import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Project } from './project.schema';

export type ProjectConfigDocument = mongoose.HydratedDocument<ProjectConfig>;

@Schema()
export class ProjectConfig {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: Project;

  @Prop()
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed
  })
  value: any;
}

export const ProjectConfigSchema = SchemaFactory.createForClass(ProjectConfig);