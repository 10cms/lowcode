import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = mongoose.HydratedDocument<User>;
export type UserModel = mongoose.Model<User>;