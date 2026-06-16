import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('api/v1/games')
export class GamesController {
  constructor(private readonly service: GamesService) {}

  @Get()
  async findAll() {
    try {
      return await this.service.findAll();
    } catch (err: any) {
      console.error('GamesController.findAll error:', err?.message || err);
      return [];
    }
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
