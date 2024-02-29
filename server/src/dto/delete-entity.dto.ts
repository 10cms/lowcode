import { JSONSchemaType } from "ajv"

export interface DeleteEntityDto {
  slug: string,
  projectSlug: string
}

export const DeleteEntitySchema: JSONSchemaType<DeleteEntityDto> = {
  type: "object",
  properties: {
    slug: {type: "string"},
    projectSlug: {type: "string"}
  },
  required: ["slug", "projectSlug"]
}