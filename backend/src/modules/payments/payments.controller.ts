import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
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
      return await this.service.listCards();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('PaymentsController.listCards error:', err?.message || err);
      throw new InternalServerErrorException("Karta ma'lumotlarini yuklashda xatolik yuz berdi");
    }
  }
}
