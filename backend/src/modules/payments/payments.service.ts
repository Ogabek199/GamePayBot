import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async listMethods() {
    return this.prisma.paymentMethod.findMany({ where: { active: true } });
  }
}
