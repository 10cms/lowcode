import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResourceDocument } from './resource.schema';
import * as mongoose from 'mongoose';

export enum ResourceFieldType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

@Schema()
export class ResourceField {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true })
  resource: ResourceDocument
  
  @Prop({ required: true })
  slug: string;
  
  @Prop({ required: true })
  name: string;
  
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  type: ResourceFieldType
}

export type ResourceFieldDocument = mongoose.HydratedDocument<ResourceField>;
export type ResourceFieldModel = mongoose.Model<ResourceFieldDocument>;

export const ResourceFieldSchema = SchemaFactory.createForClass(ResourceField);
ResourceFieldSchema.index({ resource: 1, slug: 1 }, { unique: true });
ResourceFieldSchema.index({ resource: 1, name: 1 }, { unique: true });