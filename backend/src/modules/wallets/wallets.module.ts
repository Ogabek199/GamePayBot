import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { JwtService } from '../../common/jwt.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Module({
  providers: [WalletsService, JwtService, JwtAuthGuard],
  controllers: [WalletsController],
  exports: [WalletsService],
})
export class WalletsModule {}
