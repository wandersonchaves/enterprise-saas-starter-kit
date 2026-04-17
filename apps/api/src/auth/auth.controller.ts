import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterRequest, LoginRequest } from '@enterprise/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterRequest) {
    return this.authService.register(data.email, data.password, data.name);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginRequest) {
    return this.authService.login(data.email, data.password);
  }
}
