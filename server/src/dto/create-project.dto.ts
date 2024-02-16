import { JSONSchemaType } from "ajv"

export interface CreateProjectDto {
  name: string
  slug: string
}

export const CreateProjectSchema: JSONSchemaType<CreateProjectDto> = {
  type: "object",
  properties: {
    name: {type: "string", minLength: 1, maxLength: 100},
    slug: {type: "string", minLength: 1, maxLength: 100},
  },
  required: ["name", "slug"]
}