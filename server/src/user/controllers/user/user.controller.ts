import { Controller, Get, Session } from '@nestjs/common';
import { UserDocument } from 'src/user/schemas/user.schema';

@Controller('user')
export class UserController {
  @Get('profile')
  async profile (@Session() user: UserDocument) {
    return {
      id: user.id
    }
  }
}
