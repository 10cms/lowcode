import {JSONSchemaType} from "ajv"
import { Injectable } from '@nestjs/common';
import { ValidationPipe } from "src/pipes/validation.pipe";

export interface UpdateResourceDto {
  name?: string
  slug?: string
}

@Injectable()
export class UpdateResourcePipe extends ValidationPipe<UpdateResourceDto> {
  protected schema: JSONSchemaType<UpdateResourceDto> = {
    type: "object",
    $async: true,
    properties: {
      slug: {
        type: "string", minLength: 1, maxLength: 100, nullable: true
      },
      name: {
        type: "string", minLength: 1, maxLength: 100, nullable: true
      }
    }
  }
}