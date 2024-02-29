import { JSONSchemaType } from "ajv"

export interface CreateEntityDto {
  name: string
  slug: string
  projectSlug: string
}

export const CreateEntitySchema: JSONSchemaType<CreateEntityDto> = {
  type: "object",
  properties: {
    name: {type: "string"},
    slug: {type: "string"},
    projectSlug: {type: "string"},
  },
  required: ["name", "slug", "projectSlug"]
}