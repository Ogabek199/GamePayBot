import { Controller, Get, Param, Query } from '@nestjs/common';
import { PackagesService } from './packages.service';

@Controller('packages')
export class PackagesController {
  constructor(private readonly service: PackagesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-game/:gameId')
  findByGame(@Param('gameId') gameId: string) {
    return this.service.findByGame(gameId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
