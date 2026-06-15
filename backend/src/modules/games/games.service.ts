import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.game.findMany({ include: { packages: true } });
  }

  async findOne(id: string) {
    const g = await this.prisma.game.findUnique({ where: { id }, include: { packages: true } });
    if (!g) throw new NotFoundException('Game not found');
    return g;
  }
}
