import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type EntityFieldDocument = mongoose.HydratedDocument<EntityField>;

@Schema()
export class EntityField {
  @Prop()
  name: string;

  @Prop()
  type: string;
}

export const EntityFieldSchema = SchemaFactory.createForClass(EntityField);