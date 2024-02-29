import {JSONSchemaType} from "ajv"
import { Injectable } from '@nestjs/common';
import { ValidationPipe } from "src/pipes/validation.pipe";
import { Resource } from "../schemas/resource.schema";
import { ResourceFieldType } from "../schemas/resource-field.schema";

export interface UpdateResourceFieldDto {
  name: string | undefined
}

@Injectable()
export class UpdateResourceFieldPipe extends ValidationPipe<UpdateResourceFieldDto> {
  protected schema: JSONSchemaType<UpdateResourceFieldDto> = {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1, maxLength: 100, nullable: true },
    }
  }
}