import { getPageMetadata } from "@/lib/metadata";
import { getHostnameFromUrl } from "@/utils";
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
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		likedAt: t.expose("likedAt", { type: "DateTime", nullable: true }),
		archivedAt: t.expose("archivedAt", {
			type: "DateTime",
			nullable: true,
		}),
		liked: t.field({
			type: "Boolean",
			resolve: bookmark => !!bookmark.likedAt,
		}),
		archived: t.field({
			type: "Boolean",
			resolve: bookmark => !!bookmark.archivedAt,
		}),
	}),
});

const BookmarksFilterInput = builder.inputType("BookmarksFilterInput", {
	fields: t => ({
		title: t.string(),
		liked: t.boolean({ defaultValue: undefined }),
		archived: t.boolean({ defaultValue: undefined }),
	}),
});

const BookmarksSortOrderEnum = builder.enumType("BookmarksSortOrderEnum", {
	values: ["createdAt", "likedAt", "archivedAt"] as const,
});

builder.queryField("bookmarks", t =>
	t.prismaField({
		authScopes: { user: true },
		type: ["Bookmark"],
		args: {
			filter: t.arg({ type: BookmarksFilterInput }),
			sort: t.arg({
				type: BookmarksSortOrderEnum,
				required: true,
				defaultValue: "createdAt",
			}),
			oldestFirst: t.arg.boolean({ defaultValue: false }),
		},
		resolve: async (
			query,
			_root,
			{ filter, oldestFirst, sort },
			{ user }
		) => {
			const sortOrder = oldestFirst ? "asc" : "desc";

			// TODO: how to make this less ugly?
			const filterToQueryOption = (filter: boolean | undefined | null) =>
				filter != null
					? { [filter ? "not" : "equals"]: null }
					: undefined;

			const queryStringToPostgresOperators = (query: string) =>
				query
					.split(" ")
					.map(value => value.trim())
					.filter(Boolean)
					.join(" & ");

			return db.bookmark.findMany({
				...query,
				where: {
					userId: user!.id,
					...(filter?.title && {
						title: {
							search: queryStringToPostgresOperators(
								filter.title
							),
						},
					}),
					likedAt: filterToQueryOption(filter?.liked),
					archivedAt: filterToQueryOption(filter?.archived),
				},
				orderBy: { [sort]: sortOrder },
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
			const metadata = await getPageMetadata(input.url);

			const title =
				input.title ?? metadata.title ?? getHostnameFromUrl(input.url);

			return db.bookmark.create({
				...query,
				data: {
					userId: user!.id,
					url: input.url,
					title,
					image: metadata.image,
				},
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

			const inputToDateValue = (bool: boolean | undefined) =>
				bool === undefined ? undefined : bool ? new Date() : null;

			return db.bookmark.update({
				...query,
				where: { id },
				data: {
					title: input?.title ?? undefined,
					likedAt: inputToDateValue(input?.liked ?? undefined),
					archivedAt: inputToDateValue(input?.archived ?? undefined),
				},
			});
		},
	})
);

builder.mutationField("deleteBookmark", t =>
	t.field({
		type: BookmarkObject,
		authScopes: { user: true },
		args: {
			id: t.arg.string({ required: true }),
		},
		resolve: async (_, args, { user }) => {
			await db.bookmark.findFirst({
				where: { id: args.id, userId: user!.id },
				rejectOnNotFound: true,
			});

			return await db.bookmark.delete({ where: { id: args.id } });
		},
	})
);
