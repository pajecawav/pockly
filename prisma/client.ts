import { PrismaClient } from "@prisma/client";

export const db = ((global as any).db as PrismaClient) || new PrismaClient();

// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem
if (process.env.NODE_ENV !== "production") {
	(global as any).db = db;
}
