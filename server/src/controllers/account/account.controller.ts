import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';

@Controller('account')
export class AccountController {

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    if (loginDto.username === 'demo' && loginDto.password === 'demo') {
      return {
        success: true,  
      };
    } else {
      return {
        success: false,  
      };
    }
  }
}
