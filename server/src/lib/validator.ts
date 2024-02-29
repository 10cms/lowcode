import Ajv, { JSONSchemaType } from "ajv"
import { Connection } from "mongoose"
import { I18nService } from "nestjs-i18n"
import { set } from 'json-pointer'
import { DataValidationCxt } from "ajv/dist/types"

export const isObjectIdString = (value: string) => {
  const regex = /^[0-9a-f]{24}$/;
  return typeof value === 'string' && regex.test(value)
}

let connection: Connection
let i18n: I18nService 

export const setConnection = (conn: Connection) => connection = conn
export const setI18n = (service: I18nService) => i18n = service

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  useDefaults: true
})

ajv.addFormat('objectId', /^[0-9a-f]{24}$/);

ajv.addKeyword({
  keyword: "existInDb",
  schema: true,
  async: true,
  modifying: true,
  validate: async (
    schema: {model:string, field?: string, modify?: boolean},
    value: string | number,
    parentSchema: JSONSchemaType<any>,
    context: DataValidationCxt
  ) => {
    const model = connection.model(schema.model)
    const field = schema.field || '_id'
    const modify = schema.modify === undefined ? true : schema.modify

    try {
      const doc = await model.findOne({ [field]: value }).orFail()

      if (modify) {
        set(context.rootData, context.instancePath, doc)
      }

      return true
    } catch (error) {
      return false
    }
  },
  error: {
    message: () => i18n.t('validation.notExist')
  }
})

ajv.addKeyword({
  keyword: "notExistInDb",
  schema: true,
  async: true,
  modifying: false,
  validate: async (
    schema: {model:string, field?: string},
    value: string | number,
    parentSchema: JSONSchemaType<any>,
    context: DataValidationCxt
  ) => {
    const model = connection.model(schema.model)
    const field = schema.field || '_id'
    const doc = await model.findOne({ [field]: value })
    return ! doc
  },
  error: {
    message: () => i18n.t('validation.existed')
  }
})

export const validator = ajv