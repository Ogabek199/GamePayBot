import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get('methods')
  listMethods() {
    return this.service.listMethods();
  }

  @Get('cards')
  listCards() {
    return this.service.listCards();
  }
}
