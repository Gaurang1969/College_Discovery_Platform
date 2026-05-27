import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    return new PrismaClient({ 
      adapter: new PrismaPg(pool) 
    });
  } catch (error) {
    console.error("CRITICAL: Prisma failed to initialize:", error);
    throw error; // This ensures the error shows up in your terminal
  }
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}