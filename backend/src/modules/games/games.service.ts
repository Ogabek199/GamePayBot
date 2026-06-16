import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.game.findMany({
      where: { status: 'active' },
      include: { packages: { where: { status: 'active' } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const g = await this.prisma.game.findUnique({
      where: { id },
      include: { packages: { where: { status: 'active' } } },
    });
    if (!g || g.status !== 'active') throw new NotFoundException('Game not found');
    return g;
  }

  async findBySlug(slug: string) {
    const g = await this.prisma.game.findUnique({
      where: { slug },
      include: { packages: { where: { status: 'active' }, orderBy: { price: 'asc' } } },
    });
    if (!g || g.status !== 'active') throw new NotFoundException('Game not found');
    return g;
  }
}