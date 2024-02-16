import { JSONSchemaType } from "ajv"

export interface CreateEntityDto {
  name: string
}

export const CreateEntitySchema: JSONSchemaType<CreateEntityDto> = {
  type: "object",
  properties: {
    name: {type: "string"}
  },
  required: ["name"]
}