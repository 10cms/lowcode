import { JSONSchemaType } from "ajv"

export interface UpdateEntityDto {
  projectSlug: string
  slug: string
  name: string
}

export const UpdateEntitySchema: JSONSchemaType<UpdateEntityDto> = {
  type: "object",
  properties: {
    projectSlug: {type: "string"},
    slug: {type: "string"},
    name: {type: "string"},
  },
  required: ["projectSlug", "slug", "name"]
}