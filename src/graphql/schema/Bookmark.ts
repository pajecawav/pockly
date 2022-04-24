import { db } from "prisma/client";
import { builder } from "../builder";

export const BookmarkObject = builder.prismaObject("Bookmark", {
	findUnique: bookmark => ({ id: bookmark.id }),
	fields: t => ({
		id: t.exposeID("id"),
		url: t.exposeString("url"),
		title: t.exposeString("title"),
		body: t.exposeString("body", { nullable: true }),
		image: t.exposeString("image", { nullable: true }),
		liked: t.exposeBoolean("liked"),
		archived: t.exposeBoolean("archived"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
	}),
});

const BookmarksFilterInput = builder.inputType("BookmarksFilterInput", {
	fields: t => ({
		liked: t.boolean({ defaultValue: undefined }),
		archived: t.boolean({ defaultValue: undefined }),
	}),
});

builder.queryField("bookmarks", t =>
	t.prismaField({
		authScopes: { user: true },
		type: ["Bookmark"],
		args: {
			filter: t.arg({ type: BookmarksFilterInput }),
		},
		resolve: async (query, _root, { filter }, { user }) => {
			return db.bookmark.findMany({
				...query,
				where: {
					userId: user!.id,
					liked: filter?.liked ?? undefined,
					archived: filter?.archived ?? undefined,
				},
				// TODO: proper ordering based on a filter
				orderBy: { createdAt: "desc" },
			});
		},
	})
);

const CreateBookmarkInput = builder.inputType("CreateBookmarkInput", {
	fields: t => ({
		url: t.string({
			required: true,
			validate: { url: true },
		}),
		title: t.string({
			required: true,
			validate: { minLength: 1, maxLength: 100 },
		}),
	}),
});

builder.mutationField("createBookmark", t =>
	t.prismaField({
		type: "Bookmark",
		authScopes: { user: true },
		args: {
			input: t.arg({
				type: CreateBookmarkInput,
				required: true,
			}),
		},
		resolve: async (query, _parent, { input }, { user }) => {
			// TODO: fetch title from the page if not provided
			return db.bookmark.create({
				...query,
				data: { userId: user!.id, url: input.url, title: input.title },
			});
		},
	})
);

const UpdateBookmarkInput = builder.inputType("UpdateBookmarkInput", {
	fields: t => ({
		title: t.string({
			required: false,
			validate: { minLength: 1, maxLength: 100 },
		}),
		liked: t.boolean({ required: false }),
		archived: t.boolean({ required: false }),
	}),
});

builder.mutationField("updateBookmark", t =>
	t.prismaField({
		type: "Bookmark",
		authScopes: { user: true },
		args: {
			id: t.arg.string({ required: true }),
			input: t.arg({ type: UpdateBookmarkInput }),
		},
		resolve: async (query, _parent, { id, input }, { user }) => {
			await db.bookmark.findFirst({
				where: { id, userId: user!.id },
				rejectOnNotFound: true,
			});

			return db.bookmark.update({
				...query,
				where: { id },
				data: {
					title: input?.title ?? undefined,
					liked: input?.liked ?? undefined,
					archived: input?.archived ?? undefined,
				},
			});
		},
	})
);

builder.mutationField("deleteBookmark", t =>
	t.boolean({
		authScopes: { user: true },
		args: {
			id: t.arg.string({ required: true }),
		},
		resolve: async (_, args, { user }) => {
			await db.bookmark.findFirst({
				where: { id: args.id, userId: user!.id },
				rejectOnNotFound: true,
			});

			await db.bookmark.delete({ where: { id: args.id } });

			return true;
		},
	})
);
