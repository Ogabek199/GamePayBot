import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { BotModule } from '../bot/bot.module';
import { JwtService } from '../../common/jwt.service';
import JwtAuthGuard from '../../common/guards/jwt.guard';

@Module({
  imports: [BotModule],
  providers: [DepositsService, JwtService, JwtAuthGuard],
  controllers: [DepositsController],
  exports: [DepositsService],
})
export class DepositsModule {}
