import { JSONSchemaType } from "ajv"

export interface GetEntityDto {
  projectSlug: string,
  slug: string
}

export const GetEntitySchema: JSONSchemaType<GetEntityDto> = {
  type: "object",
  properties: {
    projectSlug: {type: "string"},
    slug: {type: "string"},
  },
  required: ["projectSlug", "slug"]
}