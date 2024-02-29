import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
import * as MongooseDelete from 'mongoose-delete';

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;
}

export type ProjectDocument = mongoose.HydratedDocument<Project> & SoftDeleteDocument;
export type ProjectModel = SoftDeleteModel<ProjectDocument>;

export const projectFeatury = {
  name: Project.name,
  useFactory: () => {
    const schema = SchemaFactory.createForClass(Project);
    schema.plugin(MongooseDelete, { overrideMethods: true, deletedBy: true, deletedAt: true });
    return schema
  },
  inject: [],
}