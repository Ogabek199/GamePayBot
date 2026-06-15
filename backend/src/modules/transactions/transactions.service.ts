import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findByWallet(walletId: string) {
    return this.prisma.transaction.findMany({ where: { walletId }, orderBy: { createdAt: 'desc' } });
  }
}
