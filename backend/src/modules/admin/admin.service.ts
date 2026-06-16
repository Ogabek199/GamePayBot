import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { DepositsService } from '../deposits/deposits.service';
import { BotService } from '../bot/bot.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private deposits: DepositsService,
    private botService: BotService,
  ) {}

  async dashboard() {
    const totalUsers = await this.prisma.user.count();
    const totalOrders = await this.prisma.order.count();
    const totalRevenue = await this.prisma.order.aggregate({ _sum: { price: true } });
    const pendingOrders = await this.prisma.order.count({ where: { status: 'pending' } });
    const pendingDeposits = await this.prisma.deposit.count({ where: { status: 'pending' } });
    return { totalUsers, totalOrders, totalRevenue, pendingOrders, pendingDeposits };
  }

  listOrders(filter: any) {
    return this.prisma.order.findMany({ where: filter, include: { user: true, game: true, package: true } });
  }

  async updateOrder(id: string, data: any) {
    const order = await this.prisma.order.update({ 
      where: { id }, 
      data,
      include: { user: true, game: true, package: true }
    });

    if (data.status === 'completed' || data.status === 'rejected') {
      if (order.user?.telegramId) {
        let msg = '';
        if (data.status === 'completed') {
          const amount = Number(order.price).toLocaleString('ru-RU');
          msg = `✅ Buyurtmangiz tasdiqlandi!\n\nID: #${order.id}\nO'yin: ${order.game?.name}\nPaket: ${order.package?.title}\nNarxi: ${amount} UZS`;
        } else {
          msg = `❌ Buyurtmangiz bekor qilindi.\n\nID: #${order.id}\nO'yin: ${order.game?.name}`;
        }
        this.botService.notifyUser(order.user.telegramId, msg).catch(() => {});
      }
    }

    return order;
  }

  // --- Deposits ---
  listDeposits(status?: string) {
    return this.deposits.listAll(status);
  }

  approveDeposit(id: string) {
    return this.deposits.approve(id);
  }

  rejectDeposit(id: string, reason: string) {
    return this.deposits.reject(id, reason);
  }
}
