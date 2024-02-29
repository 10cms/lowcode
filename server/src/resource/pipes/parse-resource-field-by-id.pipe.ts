import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';
import { isObjectIdString } from 'src/lib/validator';
import { ResourceFieldService } from '../services/resource-field/resource-field.service';

@Injectable()
export class ParseResourceFieldByIdPipe implements PipeTransform {
  constructor(
    private readonly resourceFieldService: ResourceFieldService
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (! isObjectIdString(value)) {
      throw new BadRequestException('Invalid Resource Field ID');
    }

    const resource = await this.resourceFieldService.resourceFieldModel.findById(value);
    if (! resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }
}