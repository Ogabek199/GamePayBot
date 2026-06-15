import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  listMethods() {
    return this.prisma.paymentMethod.findMany({ where: { active: true } });
  }

  // Active manual-transfer cards shown on the deposit/payment screens.
  listCards() {
    return this.prisma.paymentCard.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
