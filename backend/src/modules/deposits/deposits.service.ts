import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { BotService } from '../bot/bot.service';

const ANTI_SPAM_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class DepositsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private bot: BotService,
  ) {
    console.log('DEBUG: DepositsService constructor called, registering handler...');
    this.registerHandler();
  }

  // Register the Telegram inline-button handler so admins can approve/reject
  // a deposit directly from the notification message.
  private registerHandler() {
    this.bot.registerDepositActionHandler(async (action, depositId) => {
      console.log(`DEBUG: Handler executed for action: ${action}, id: ${depositId}`);
      if (action === 'approve') {
        const dep = await this.approve(depositId);
        return `✅ Deposit #${dep.id.slice(0, 8)} tasdiqlandi`;
      }
      const dep = await this.reject(depositId, "To'lov topilmadi");
      return `❌ Deposit #${dep.id.slice(0, 8)} rad etildi`;
    });
  }

  onModuleInit() {
    // Already registered in constructor
  }

  async create(userId: string, amount: number, cardId: string) {
    const card = await this.prisma.paymentCard.findUnique({ where: { id: cardId } });
    if (!card || !card.isActive) {
      throw new NotFoundException('To\'lov kartasi topilmadi');
    }
    if (amount <= 0) {
      throw new BadRequestException('Summa noto\'g\'ri');
    }

    // Anti-spam: same user + same amount + still pending within the last 5 minutes.
    const since = new Date(Date.now() - ANTI_SPAM_WINDOW_MS);
    const duplicate = await this.prisma.deposit.findFirst({
      where: {
        userId,
        amount,
        status: 'pending',
        createdAt: { gte: since },
      },
    });
    if (duplicate) {
      throw new ConflictException("Sizda hali tasdiqlanmagan to'lov mavjud");
    }

    const deposit = await this.prisma.deposit.create({
      data: { userId, cardId, amount, status: 'pending' },
      include: { user: true, card: true },
    });

    // Notify admin (fire-and-forget — a notification failure must not fail the request).
    if (process.env.NODE_ENV !== 'production') {
      console.log(`DEBUG: Attempting to send admin notification for deposit ${deposit.id}...`);
    }
    this.bot
      .notifyAdminDeposit(deposit)
      .then(() => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`DEBUG: Admin notification sent for deposit ${deposit.id}`);
        }
      })
      .catch((e) => console.error(`ERROR: notifyAdminDeposit failed for ${deposit.id}:`, e?.message, e?.stack));

    return deposit;
  }

  listMine(userId: string) {
    return this.prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { card: true },
    });
  }

  listAll(status?: string) {
    return this.prisma.deposit.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { user: true, card: true },
    });
  }

  async approve(id: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!deposit) throw new NotFoundException('Deposit topilmadi');
    if (deposit.status !== 'pending') {
      throw new BadRequestException('Bu deposit allaqachon ko\'rib chiqilgan');
    }

    // Atomically: mark approved, credit wallet, record a successful transaction.
    const [updated, wallet] = await this.prisma.$transaction(async (tx) => {
      const dep = await tx.deposit.update({
        where: { id },
        data: { status: 'approved' },
      });

      const existingWallet = await tx.wallet.findUnique({ where: { userId: deposit.userId } });
      const wal = existingWallet
        ? await tx.wallet.update({
            where: { userId: deposit.userId },
            data: { balance: { increment: deposit.amount } },
          })
        : await tx.wallet.create({
            data: { userId: deposit.userId, balance: deposit.amount },
          });

      await tx.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'deposit',
          amount: deposit.amount,
          status: 'success',
        },
      });

      return [dep, wal];
    });

    // Notify the user.
    if (deposit.user?.telegramId) {
      this.bot
        .notifyUser(
          deposit.user.telegramId,
          `✅ To'lov tasdiqlandi\n\n${this.fmt(deposit.amount)} UZS balansingizga qo'shildi.\n\nJoriy balans: ${this.fmt(wallet.balance)} UZS`,
        )
        .catch((e) => console.error('notifyUser failed:', e?.message));
    }

    return updated;
  }

  async reject(id: string, reason: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!deposit) throw new NotFoundException('Deposit topilmadi');
    if (deposit.status !== 'pending') {
      throw new BadRequestException('Bu deposit allaqachon ko\'rib chiqilgan');
    }

    const updated = await this.prisma.deposit.update({
      where: { id },
      data: { status: 'rejected', adminNote: reason },
    });

    if (deposit.user?.telegramId) {
      this.bot
        .notifyUser(
          deposit.user.telegramId,
          `❌ To'lov rad etildi\n\nSabab: ${reason || "Noma'lum"}`,
        )
        .catch((e) => console.error('notifyUser failed:', e?.message));
    }

    return updated;
  }

  private fmt(value: any) {
    return Number(value).toLocaleString('ru-RU');
  }
}
