import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const totalUsers = await this.prisma.user.count();
    const totalOrders = await this.prisma.order.count();
    const totalRevenue = await this.prisma.order.aggregate({ _sum: { price: true } });
    const pendingOrders = await this.prisma.order.count({ where: { status: 'pending' } });
    return { totalUsers, totalOrders, totalRevenue, pendingOrders };
  }

  async listOrders(filter: any) {
    return this.prisma.order.findMany({ where: filter, include: { user: true, game: true, package: true } });
  }

  async updateOrder(id: string, data: any) {
    return this.prisma.order.update({ where: { id }, data });
  }
}
