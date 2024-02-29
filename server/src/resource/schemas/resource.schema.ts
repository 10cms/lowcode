import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ProjectDocument } from '../../project/schemas/project.schema';

@Schema()
export class Resource {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true })
  project: ProjectDocument;
  
  @Prop({ required: true })
  slug: string;
  
  @Prop({ required: true })
  name: string;
}

export type ResourceDocument = mongoose.HydratedDocument<Resource>;
export type ResourceModel = mongoose.Model<ResourceDocument>;

export const ResourceSchema = SchemaFactory.createForClass(Resource);
ResourceSchema.index({ project: 1, slug: 1 }, { unique: true });
ResourceSchema.index({ project: 1, name: 1 }, { unique: true });