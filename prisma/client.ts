import { PrismaClient } from "@prisma/client";
import isCi from "is-ci";

// HACK: This module is imported during graphql types generation in CI where no
// `DATABASE_URL` env variable is specified so the prisma client throws an
// error and stops generation script from working. To avoid this we detect CI
// environment and avoid instantiating PrismaClient in those.
export const db = isCi
	? (null as any as PrismaClient)
	: ((global as any).db as PrismaClient) || new PrismaClient();

// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem
if (process.env.NODE_ENV !== "production") {
	(global as any).db = db;
}
