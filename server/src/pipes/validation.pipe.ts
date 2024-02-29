import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {JSONSchemaType, ValidateFunction} from "ajv"
import { Connection } from 'mongoose';
import * as pointer from 'json-pointer'
import { I18nService } from 'nestjs-i18n';
import { setConnection, setI18n, validator } from 'src/lib/validator';

@Injectable()
export abstract class ValidationPipe<T> implements PipeTransform {
  private validate: ValidateFunction<T>
  protected abstract schema: JSONSchemaType<T>

  constructor(
    @InjectConnection() connection: Connection,
    readonly i18n: I18nService
  ) {
    setConnection(connection)
    setI18n(i18n)
  }

  private initValidate() {
    if (!this.validate) {
      if (!this.schema) {
        throw new Error('validation.missSchema')
      }

      this.validate = validator.compile(this.schema)
    }
  }

  async transform(value: unknown, metadata: ArgumentMetadata) {
    this.initValidate()

    try {
      await this.validate(value)
      return value
    } catch (exception) {
      const errors: { [k:string]: string } = {}
      exception.errors?.forEach((error) => {
        if (error.keyword === 'required') {
          const path = [error.instancePath, error.params.missingProperty].join('/')
          pointer.set(errors, path, this.i18n.t('validation.required'))
        } else if (error.instancePath && error.message) {
          pointer.set(errors, error.instancePath, error.message)
        } else {
          console.error('Unkonw error', error, error.params)
          throw new Error('Unkonw error')
        }
      })

      throw new BadRequestException(errors)
    }
  }
}