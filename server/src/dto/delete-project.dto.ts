import { JSONSchemaType } from "ajv"

export interface DeleteProjectDto {
  slug: string
}

export const DeleteProjectSchema: JSONSchemaType<DeleteProjectDto> = {
  type: "object",
  properties: {
    slug: {type: "string", minLength: 1, maxLength: 100},
  },
  required: ["slug"]
}