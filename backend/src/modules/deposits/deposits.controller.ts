import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import JwtAuthGuard from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/deposits')
export class DepositsController {
  constructor(private readonly service: DepositsService) {}

  @Post()
  create(@Body() body: CreateDepositDto, @CurrentUser() user: any) {
    return this.service.create(user.sub, body.amount, body.cardId);
  }

  @Get('me')
  listMine(@CurrentUser() user: any) {
    return this.service.listMine(user.sub);
  }
}
