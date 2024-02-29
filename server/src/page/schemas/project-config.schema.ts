import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Project } from '../../project/schemas/project.schema';

export type ProjectConfigDocument = mongoose.HydratedDocument<ProjectConfig>;

@Schema()
export class ProjectConfig {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  @Prop({ required: true })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true
  })
  value: any;

}

export const ProjectConfigSchema = SchemaFactory.createForClass(ProjectConfig);
ProjectConfigSchema.index({ project: 1, slug: 1 }, { unique: true });