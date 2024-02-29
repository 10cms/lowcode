import {JSONSchemaType} from "ajv"
import { Injectable } from '@nestjs/common';
import { ValidationPipe } from "src/pipes/validation.pipe";
import { Resource } from "../schemas/resource.schema";
import { ResourceFieldType } from "../schemas/resource-field.schema";

export interface CreateResourceFieldDto {
  resource: string
  name: string
  slug: string
  type: string
}

@Injectable()
export class CreateResourceFieldPipe extends ValidationPipe<CreateResourceFieldDto> {
  protected schema: JSONSchemaType<CreateResourceFieldDto> = {
    type: "object",
    $async: true,
    properties: {
      resource: {
        type: "string", format: "objectId",
        existInDb: {
          model: Resource.name
        }
      },
      slug: { type: "string", minLength: 1, maxLength: 100 },
      name: { type: "string", minLength: 1, maxLength: 100 },
      type: { type: "string", enum: Object.values(ResourceFieldType) }
    },
    required: ["resource", "name", "slug", "type"]
  }
}