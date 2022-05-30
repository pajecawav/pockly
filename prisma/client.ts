import { PrismaClient } from "@prisma/client";

// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem
declare global {
	var db: PrismaClient | undefined;
}

const prisma =
	global.db ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === "production"
				? ["error", "warn"]
				: ["error", "warn", "query"],
	});

if (process.env.NODE_ENV !== "production") {
	global.db = prisma;
}

export const db = prisma;
