import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { BotService } from '../bot/bot.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private botService: BotService,
  ) {
    this.botService.registerOrderActionHandler(async (action, orderId) => {
      const order = await this.findOne(orderId).catch(() => null);
      if (!order) return 'Buyurtma topilmadi';

      if (action === 'approve') {
        if (order.status !== 'pending') return 'Faqat kutilayotgan buyurtmani tasdiqlash mumkin';
        await this.updateStatus(orderId, 'completed');
        
        const user = await this.prisma.user.findUnique({ where: { id: order.userId } });
        if (user?.telegramId) {
          const amount = Number(order.price).toLocaleString('ru-RU');
          const msg = `✅ Buyurtmangiz tasdiqlandi!\n\nID: #${order.id}\nO'yin: ${order.game?.name}\nPaket: ${order.package?.title}\nNarxi: ${amount} UZS`;
          await this.botService.notifyUser(user.telegramId, msg);
        }
        return `Buyurtma #${orderId} tasdiqlandi`;
      } 
      
      if (action === 'reject') {
        if (order.status !== 'pending') return 'Faqat kutilayotgan buyurtmani bekor qilish mumkin';
        
        await this.prisma.$transaction(async (tx) => {
          await tx.order.update({ where: { id: orderId }, data: { status: 'rejected' } });
          await tx.wallet.update({
            where: { userId: order.userId },
            data: { balance: { increment: order.price } }
          });
        });

        const user = await this.prisma.user.findUnique({ where: { id: order.userId } });
        if (user?.telegramId) {
          const msg = `❌ Buyurtmangiz bekor qilindi va pulingiz qaytarildi.\n\nID: #${order.id}\nO'yin: ${order.game?.name}`;
          await this.botService.notifyUser(user.telegramId, msg);
        }
        return `Buyurtma #${orderId} bekor qilindi`;
      }

      return 'Noma\'lum amal';
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { game: true, package: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const o = await this.prisma.order.findUnique({
      where: { id },
      include: { game: true, package: true },
    });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  /** Purchase a game package using wallet balance. */
  async purchase(userId: string, packageId: string, uid: string, region?: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
      include: { game: true },
    });
    if (!pkg || pkg.status !== 'active') {
      throw new NotFoundException('Paket topilmadi');
    }
    if (!pkg.game || pkg.game.status !== 'active') {
      throw new NotFoundException('O\'yin topilmadi');
    }

    const price = Number(pkg.price);

    const result = await this.prisma.$transaction(async (tx) => {
      // Balansni transaction ICHIDA tekshiramiz, shu sabab race condition yo'qoladi
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      const balance = Number(wallet?.balance ?? 0);

      if (balance < price) {
        throw new BadRequestException(
          `Balans yetarli emas. Kerak: ${price.toLocaleString('ru-RU')} UZS, mavjud: ${balance.toLocaleString('ru-RU')} UZS`,
        );
      }

      await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: price } },
      });

      const order = await tx.order.create({
        data: {
          userId,
          gameId: pkg.gameId,
          packageId: pkg.id,
          uid,
          region: region ?? 'Global',
          price: pkg.price,
          currency: 'UZS',
          status: 'pending',
        },
        include: { game: true, package: true },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: 'order',
          amount: pkg.price,
          status: 'pending',
        },
      });

      return order;
    });
    
    // Notify admin
    this.botService.notifyAdminOrder({
      ...result,
      user: await this.prisma.user.findUnique({ where: { id: userId } })
    }).catch(err => console.error('[Orders] Failed to notify admin:', err?.message));

    return result;
  }
}