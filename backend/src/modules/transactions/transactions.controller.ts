import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  findByWallet(@Query('walletId') walletId: string) {
    return this.service.findByWallet(walletId);
  }
}
