import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the wallet for a user, creating an empty one if it does not exist.
   */
  async getOrCreateForUser(userId: string) {
    const existing = await this.prisma.wallet.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.wallet.create({ data: { userId, balance: 0 } });
  }

  /** User-scoped dashboard stats for the home screen. */
  async getUserStats(userId: string) {
    const wallet = await this.getOrCreateForUser(userId);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [todayDeposits, todayOrders, pendingDeposits] = await Promise.all([
      this.prisma.deposit.aggregate({
        where: {
          userId,
          status: 'approved',
          createdAt: { gte: startOfDay },
        },
        _sum: { amount: true },
      }),
      this.prisma.order.aggregate({
        where: {
          userId,
          status: 'completed',
          createdAt: { gte: startOfDay },
        },
        _sum: { price: true },
      }),
      this.prisma.deposit.count({
        where: { userId, status: 'pending' },
      }),
    ]);

    const todayPayments =
      Number(todayDeposits._sum.amount ?? 0) + Number(todayOrders._sum.price ?? 0);

    return {
      balance: Number(wallet.balance),
      todayPayments,
      pendingDeposits,
    };
  }
}