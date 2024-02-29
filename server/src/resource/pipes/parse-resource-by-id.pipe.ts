import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';
import { isObjectIdString } from 'src/lib/validator';
import { ResourceService } from '../services/resource/resource.service';

@Injectable()
export class ParseResourceByIdPipe implements PipeTransform {
  constructor(
    private readonly resourceService: ResourceService
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (! isObjectIdString(value)) {
      throw new BadRequestException('Invalid Resource ID');
    }

    const resource = await this.resourceService.resourceModel.findById(value);
    if (! resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }
}