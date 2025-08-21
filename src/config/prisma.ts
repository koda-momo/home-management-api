/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { getNowInJapan } from '../utils/timezone.js';

const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any;
};

// 日本時間対応のクエリエクステンションを作成
const basePrisma = new PrismaClient();
export const prisma = basePrisma.$extends({
  query: {
    $allOperations({ args, query, operation }) {
      // 作成・更新処理の場合、日本時間を設定
      if ((operation === 'create' || operation === 'update') && args.data) {
        const now = getNowInJapan();

        if (operation === 'create') {
          args.data.created_at = now;
          args.data.updated_at = now;
        } else if (operation === 'update') {
          args.data.updated_at = now;
        }
      }

      return query(args);
    },
  },
});

globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function testPrismaConnection(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to MySQL database successfully');
  } catch (error) {
    console.error('❌ Prisma connection failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
