import { Controller, Get, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/wallet')
export class WalletsController {
  constructor(private readonly service: WalletsService) {}

  // Always scoped to the authenticated user — never trust a userId from the client.
  @Get('me')
  getMine(@CurrentUser() user: any) {
    return this.service.getOrCreateForUser(user.sub);
  }
}
