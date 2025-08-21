/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

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
