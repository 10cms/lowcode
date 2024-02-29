import Ajv, { JSONSchemaType } from "ajv"
import  { generateValidate } from "../pipes/validation.pipe"

export interface UpdateProjectConfigDto {
  value: string
}

export const UpdateProjectConfigSchema: JSONSchemaType<UpdateProjectConfigDto> = {
  type: "object",
  properties: {
    value: { type: "string" }
  },
  required: ["value"]
}

export const validateUpdateProjectConfig = generateValidate<UpdateProjectConfigDto>(UpdateProjectConfigSchema)