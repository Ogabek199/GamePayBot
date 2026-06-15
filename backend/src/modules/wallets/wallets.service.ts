import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the wallet for a user, creating an empty one if it does not exist.
   * The schema enforces a single wallet per user (Wallet.userId is unique).
   */
  async getOrCreateForUser(userId: string) {
    const existing = await this.prisma.wallet.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.wallet.create({ data: { userId, balance: 0 } });
  }
}
