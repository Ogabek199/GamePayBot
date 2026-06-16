import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Ensure a sensible default DATABASE_URL so local/dev deployments using the
// committed sqlite file (prisma/dev.db) will work when no env var is set.
if (!process.env.DATABASE_URL) {
  // Fallback to the repo-level prisma/dev.db (same location used by migration/seed scripts).
  // Use a path relative to the backend working directory so Prisma resolves it consistently.
  process.env.DATABASE_URL = 'file:../prisma/dev.db';
  // Keep this warning minimal; in production DATABASE_URL should always be set.
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL not set — falling back to ../prisma/dev.db');
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
