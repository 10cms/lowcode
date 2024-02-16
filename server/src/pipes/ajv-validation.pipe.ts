import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import Ajv, {JSONSchemaType} from "ajv"
const ajv = new Ajv()

export class AjvValidationPipe implements PipeTransform {
  constructor(private schema: JSONSchemaType<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const validate = ajv.compile(this.schema)
    if (validate(value)) {
      return value
    } else {
      return validate.errors
    }
  }
}