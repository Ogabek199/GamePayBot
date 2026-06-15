import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { DepositDto } from './dto/deposit.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletsController {
  constructor(private readonly service: WalletsService) {}

  @Get(':userId')
  getByUser(@Param('userId') userId: string, @CurrentUser() user: any) {
    const uid = userId || user.sub;
    return this.service.getByUser(uid);
  }

  @Post('deposit')
  deposit(@Body() body: DepositDto, @CurrentUser() user: any) {
    // optionally validate wallet belongs to user in service
    return this.service.createDeposit(body.walletId, String(body.amount), { requestedBy: user.sub, currency: body.currency });
  }
}
