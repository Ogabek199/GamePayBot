import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import JwtAuthGuard from '../../common/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  create(@Body() body: CreateOrderDto, @CurrentUser() user: any) {
    return this.service.purchase(user.sub, body.packageId, body.uid, body.region);
  }

  @Get()
  findByUser(@CurrentUser() user: any) {
    return this.service.findByUser(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
