import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { PackagesModule } from './packages/packages.module';
import { OrdersModule } from './orders/orders.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { SupportModule } from './support/support.module';
import { PrismaModule } from '../common/prisma.module';

import { BotModule } from './bot/bot.module';

@Module({
  imports: [PrismaModule, AuthModule, BotModule, GamesModule, PackagesModule, OrdersModule, WalletsModule, TransactionsModule, PaymentsModule, AdminModule, SupportModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
