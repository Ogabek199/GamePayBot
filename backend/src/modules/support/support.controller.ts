import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('api/v1/support')
export class SupportController {
  constructor(private readonly service: SupportService) {}

  @Post('ticket')
  create(@Body() body: any) {
    return this.service.createTicket(body);
  }

  @Get()
  list(@Query('userId') userId: string) {
    return this.service.listForUser(userId);
  }
}
