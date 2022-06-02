import { builder } from "../builder";

export const UserObject = builder.prismaObject("User", {
	findUnique: user => ({ id: user.id }),
	fields: t => ({
		id: t.exposeID("id"),
		name: t.exposeString("name", { nullable: true }),
		image: t.exposeString("image", { nullable: true }),
	}),
});

builder.queryField("me", t =>
	t.field({
		type: UserObject,
		nullable: true,
		resolve: (_root, _args, { user }) => user,
	})
);
