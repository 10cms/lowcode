import { JSONSchemaType } from "ajv"

export interface LoginDto {
  username: string,
  password: string
}

export const LoginSchema: JSONSchemaType<LoginDto> = {
  type: "object",
  properties: {
    username: {type: "string"},
    password: {type: "string"}
  },
  required: ["username", "password"]
}