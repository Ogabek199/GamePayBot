import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { JwtService } from '../../common/jwt.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Module({
  providers: [TransactionsService, JwtService, JwtAuthGuard],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
