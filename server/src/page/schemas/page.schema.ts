import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Project } from '../../project/schemas/project.schema';

export type PageDocument = mongoose.HydratedDocument<Page>;

@Schema({
  timestamps: true,
})
export class Page {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.Mixed }], required: true })
  packages: any[];

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  schema: any;
}

export const PageSchema = SchemaFactory.createForClass(Page);