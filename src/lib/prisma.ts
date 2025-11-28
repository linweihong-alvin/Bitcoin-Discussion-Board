import { PrismaClient } from "@prisma/client";

// Extend globalThis with an optional `prisma` property so we can reuse
// the same PrismaClient instance across hot reloads in development.
// avoid create multiple PrismaClient instance while hot reloads
// hot reload: code change > don't need to restart > directly reload changed part
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Reuse the existing PrismaClient instance if it exists,
// otherwise create a new one.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, store the PrismaClient instance on the global object
// to avoid creating multiple instances during hot reload.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
