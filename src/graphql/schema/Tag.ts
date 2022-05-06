import { db } from "prisma/client";
import { builder } from "../builder";
import { BookmarkObject } from "./Bookmark";

export const TagObject = builder.prismaObject("Tag", {
	findUnique: tag => ({ id: tag.id }),
	fields: t => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		userId: t.exposeString("userId"),
	}),
});
// avoid circular reference problems
builder.objectField(TagObject, "bookmarks", t =>
	t.field({
		type: [BookmarkObject],
		resolve: (parent, _args, { user }) =>
			db.tag
				.findUnique({
					where: {
						name_userId: {
							name: parent.name,
							userId: user!.id,
						},
					},
				})
				.bookmarks(),
	})
);

builder.queryField("tags", t =>
	t.prismaField({
		authScopes: { user: true },
		type: [TagObject],
		resolve: async (query, _root, _args, { user }) => {
			// TODO: only return tags with atleast one bookmark tagged
			return db.tag.findMany({
				...query,
				where: {
					userId: user!.id,
				},
			});
		},
	})
);

builder.mutationField("deleteTag", t =>
	t.field({
		type: TagObject,
		nullable: true,
		authScopes: { user: true },
		args: {
			tag: t.arg.string({ required: true }),
		},
		resolve: async (_, args, { user }) => {
			const tag = await db.tag.findFirst({
				where: { name: args.tag, userId: user!.id },
			});

			if (!tag) {
				return null;
			}

			return await db.tag.delete({ where: { id: tag.id } });
		},
	})
);
