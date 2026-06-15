import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async getByUser(userId: string) {
    return this.prisma.wallet.findMany({ where: { userId } });
  }

  async createDeposit(walletId: string, amount: number, meta?: any) {
    const tx = await this.prisma.transaction.create({
      data: {
        walletId,
        amount,
        type: 'deposit',
        currency: 'UZS',
        meta: meta ? JSON.stringify(meta) : null,
        status: 'pending',
      },
    });
    return tx;
  }

  async completeDeposit(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true },
    });

    if (!transaction || transaction.status !== 'pending') {
      throw new NotFoundException('Pending transaction not found');
    }

    // Update wallet balance and transaction status in a transaction
    return this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: transaction.walletId },
        data: { balance: { increment: transaction.amount } },
      }),
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'completed' },
      }),
    ]);
  }
}
