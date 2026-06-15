import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.package.findMany();
  }

  async findByGame(gameId: string) {
    return this.prisma.package.findMany({ where: { gameId } });
  }

  async findOne(id: string) {
    const p = await this.prisma.package.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Package not found');
    return p;
  }
}
