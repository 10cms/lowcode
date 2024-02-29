import {JSONSchemaType} from "ajv"
import { Injectable } from '@nestjs/common';
import { ValidationPipe } from "src/pipes/validation.pipe";

export interface CreateProjectDto {
  name: string
}

export const CreateProjectSchema: JSONSchemaType<CreateProjectDto> = {
  type: "object",
  $async: true,
  properties: {
    name: {type: "string", minLength: 1, maxLength: 100}
  },
  required: ["name"]
}

@Injectable()
export class CreateProjectPipe extends ValidationPipe<CreateProjectDto> {
  protected schema = CreateProjectSchema
}