import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { JwtService } from '../../common/jwt.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Module({
  providers: [OrdersService, JwtService, JwtAuthGuard],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
