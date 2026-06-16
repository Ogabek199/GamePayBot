import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get('methods')
  listMethods() {
    return this.service.listMethods();
  }

  @Get('cards')
  async listCards() {
    try {
      const cards = await this.service.listCards();
      return cards ?? [];
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('PaymentsController.listCards error:', err?.message || err);
      // Bo'sh array qaytarish — frontend xatolik ko'rmasin
      return [];
    }
  }
}
