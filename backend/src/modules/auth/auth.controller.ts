import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  async telegram(@Body() body: TelegramAuthDto) {
    const botToken = process.env.BOT_TOKEN || '';
    const result = await this.authService.telegramLogin(body.initData, botToken);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@CurrentUser() user: any, @Body() body: { firstName: string }) {
    return this.authService.updateProfile(user.sub, body);
  }

  @Post('test-connection')
  async testConnection() {
    return { status: 'ok', message: 'Backend is reachable' };
  }
}
