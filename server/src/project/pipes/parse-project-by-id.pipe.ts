import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectService } from '../services/project/project.service';
import { isObjectIdString } from 'src/lib/validator';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ParseProjectByIdPipe implements PipeTransform {
  constructor(
    private readonly i18n: I18nService,
    private readonly projectService: ProjectService
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (! value) {
      throw new BadRequestException({
        project: this.i18n.t('validation.required')
      });
    }

    if (! isObjectIdString(value)) {
      throw new BadRequestException({
        project: this.i18n.t('validation.objectId')
      });
    }

    try {
      return await this.projectService.findById(value);
    } catch (error) {
      throw new NotFoundException({ project: this.i18n.t('validation.notExist') });
    }
  }
}