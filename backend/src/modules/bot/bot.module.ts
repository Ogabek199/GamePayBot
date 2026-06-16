import { Module, Global } from '@nestjs/common';
import { BotService } from './bot.service';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
