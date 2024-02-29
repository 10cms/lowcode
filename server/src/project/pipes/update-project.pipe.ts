import {JSONSchemaType} from "ajv"
import { Injectable } from '@nestjs/common';
import { ValidationPipe } from "src/pipes/validation.pipe";

export interface UpdateProjectDto {
  name: string
}

export const UpdateProjectSchema: JSONSchemaType<UpdateProjectDto> = {
  type: "object",
  $async: true,
  properties: {
    name: {type: "string", minLength: 1, maxLength: 100}
  },
  required: ["name"]
}

@Injectable()
export class UpdateProjectPipe extends ValidationPipe<UpdateProjectDto> {
  protected schema = UpdateProjectSchema
}