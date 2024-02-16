import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ProjectDocument = mongoose.HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);