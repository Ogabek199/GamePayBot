import { Controller, Post, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  create(@Body() body: CreateOrderDto, @CurrentUser() user: any) {
    // attach userId
    const data = { ...body, userId: user.sub };
    return this.service.create(data);
  }

  @Get()
  findByUser(@Query('userId') userId: string, @CurrentUser() user: any) {
    // if userId not provided, use current user
    const uid = userId || user.sub;
    return this.service.findByUser(uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
