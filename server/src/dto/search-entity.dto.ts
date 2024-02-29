import { JSONSchemaType } from "ajv"

export interface SearchEntityDto {
  projectSlug: string
}

export const SearchEntitySchema: JSONSchemaType<SearchEntityDto> = {
  type: "object",
  properties: {
    projectSlug: {type: "string"},
  },
  required: ["projectSlug"]
}