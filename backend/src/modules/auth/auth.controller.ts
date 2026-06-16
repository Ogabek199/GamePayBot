import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import JwtAuthGuard from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('telegram')
  async telegram(@Body() body: TelegramAuthDto) {
    const botToken = this.configService.get<string>('BOT_TOKEN');
    if (process.env.NODE_ENV !== 'production') {
    }
    const result = await this.authService.telegramLogin(body.initData, botToken || '');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@CurrentUser() user: any, @Body() body: { firstName: string }) {
    return this.authService.updateProfile(user.sub, body);
  }

  @Post('test-connection')
  async testConnection() {
    require('fs').writeFileSync('debug.log', 'DEBUG: testConnection called\n', { flag: 'a' });
    return { status: 'ok', message: 'Backend is reachable' };
  }
}
