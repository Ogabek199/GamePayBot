import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Ensure a sensible default DATABASE_URL so local/dev deployments using the
// committed sqlite file (prisma/dev.db) will work when no env var is set.
if (!process.env.DATABASE_URL) {
  // Fallback: root-level prisma/dev.db dan foydalanish
  // backend/dist/ dan ishga tushganda: ../../prisma/dev.db
  // backend/ dan ishga tushganda: ../prisma/dev.db
  const path = require('path');
  const dbPath = path.resolve(__dirname, '../../prisma/dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
