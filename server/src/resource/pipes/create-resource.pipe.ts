import {JSONSchemaType} from "ajv"
import { Injectable } from '@nestjs/common';
import { ValidationPipe } from "src/pipes/validation.pipe";
import { Resource } from "../schemas/resource.schema";
import { Project } from "src/project/schemas/project.schema";

export interface CreateResourceDto {
  project: string
  name: string
  slug: string
}

@Injectable()
export class CreateResourcePipe extends ValidationPipe<CreateResourceDto> {
  protected schema: JSONSchemaType<CreateResourceDto> = {
    type: "object",
    $async: true,
    properties: {
      project: {
        type: "string", format: "objectId",
        existInDb: {
          model: Project.name
        }
      },
      slug: { type: "string", minLength: 1, maxLength: 100 },
      name: { type: "string", minLength: 1, maxLength: 100 }
    },
    required: ["project", "name", "slug"]
  }
}