import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(data: any) {
    return this.prisma.supportTicket.create({ data });
  }

  async listForUser(userId: string) {
    return this.prisma.supportTicket.findMany({ where: { userId } });
  }
}
