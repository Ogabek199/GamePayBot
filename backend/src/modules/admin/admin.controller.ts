import { Controller, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Get('orders')
  listOrders(@Query() query: any) {
    return this.service.listOrders(query);
  }

  @Patch('orders/:id')
  updateOrder(@Param('id') id: string, @Body() body: any) {
    return this.service.updateOrder(id, body);
  }
}
