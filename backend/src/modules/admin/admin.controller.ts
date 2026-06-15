import { Controller, Get, Patch, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateDepositStatusDto } from '../deposits/dto/update-deposit.dto';

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

  @Get('deposits')
  listDeposits(@Query('status') status?: string) {
    return this.service.listDeposits(status);
  }

  @Patch('deposits/:id')
  updateDeposit(@Param('id') id: string, @Body() body: UpdateDepositStatusDto) {
    if (body.status === 'approved') {
      return this.service.approveDeposit(id);
    }
    if (body.status === 'rejected') {
      return this.service.rejectDeposit(id, body.reason || "To'lov topilmadi");
    }
    throw new BadRequestException('Invalid status');
  }
}
