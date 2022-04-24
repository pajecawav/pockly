import SchemaBuilder from "@pothos/core";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";
import { AuthScopes, Context, Scalars } from "./types";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import PrismaPlugin from "@pothos/plugin-prisma";
import { db } from "prisma/client";

export const builder = new SchemaBuilder<{
	Scalars: Scalars;
	Context: Context;
	AuthScopes: AuthScopes;
	PrismaTypes: PrismaTypes;
}>({
	// NOTE: make sure that scope-auth plugin is listed first
	plugins: [ScopeAuthPlugin, ValidationPlugin, PrismaPlugin],
	authScopes: async ctx => ({
		user: !!ctx.user,
	}),
	prisma: {
		client: db,
	},
});

builder.scalarType("DateTime", {
	serialize: value => value.toISOString(),
	parseValue: value => {
		const date = new Date(value as string);

		if (Number.isNaN(date.valueOf())) {
			throw new Error("Invalid ISO date");
		}

		return date;
	},
});
