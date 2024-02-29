import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../services/user/user.service';
import { isObjectIdString } from 'src/lib/validator';

@Injectable()
export class ParseUserByIdPipe implements PipeTransform {
  constructor(
    private readonly userService: UserService
  ) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (! isObjectIdString(value)) {
      throw new BadRequestException('Invalid User ID');
    }

    try {
      return await this.userService.findById(value);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}