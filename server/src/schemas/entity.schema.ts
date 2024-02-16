import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EntityField } from './entity-field.schema';
import * as mongoose from 'mongoose';

export type EntityDocument = mongoose.HydratedDocument<Entity>;

@Schema()
export class Entity {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EntityField' }] })
  fields: EntityField[]
}

export const EntitySchema = SchemaFactory.createForClass(Entity);