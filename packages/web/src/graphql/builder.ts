import { db } from "@pockly/prisma";
import type PrismaTypes from "@pockly/prisma/generated/pothos";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import RelayPlugin from "@pothos/plugin-relay";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";
import { AuthScopes, Context, Scalars } from "./types";

export const builder = new SchemaBuilder<{
	Scalars: Scalars;
	Context: Context;
	AuthScopes: AuthScopes;
	PrismaTypes: PrismaTypes;
}>({
	// NOTE: make sure that scope-auth plugin is listed first
	plugins: [ScopeAuthPlugin, ValidationPlugin, PrismaPlugin, RelayPlugin],
	authScopes: async ctx => ({
		user: !!ctx.user,
	}),
	prisma: {
		client: db,
	},
	relayOptions: {
		clientMutationId: "omit",
		cursorType: "String",
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
