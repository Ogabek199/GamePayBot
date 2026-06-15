import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const order = await this.prisma.order.create({ data });
    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, include: { game: true, package: true } });
  }

  async findOne(id: string) {
    const o = await this.prisma.order.findUnique({ where: { id }, include: { game: true, package: true } });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async createOrder(userId: string, gameId: string, packageId: string, uid: string, region: string) {
    const pkg = await this.prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) throw new Error('Package not found');

    return this.prisma.order.create({
      data: {
        userId,
        gameId,
        packageId,
        uid,
        region,
        price: pkg.price,
        currency: 'UZS',
        status: 'pending',
      },
    });
  }
}
