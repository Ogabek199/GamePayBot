import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { DepositsService } from '../deposits/deposits.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private deposits: DepositsService,
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

  updateOrder(id: string, data: any) {
    return this.prisma.order.update({ where: { id }, data });
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
