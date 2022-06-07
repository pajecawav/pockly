import { getPageMetadata } from "@/lib/metadata";
import {
	bookmarkNoteSchema,
	bookmarkTitleSchema,
	bookmarkUrlSchema,
	tagNameSchema,
} from "@/lib/schemas";
import { getThumbnailImage } from "@/lib/thumbnails";
import { cleanUrl } from "@/lib/urls";
import { getHostnameFromUrl } from "@/utils";
import { db } from "@pockly/prisma";
import { z } from "zod";
import { builder } from "../builder";

export const BookmarkObject = builder.prismaObject("Bookmark", {
	findUnique: bookmark => ({ id: bookmark.id }),
	fields: t => ({
		id: t.exposeID("id"),
		url: t.exposeString("url"),
		title: t.exposeString("title"),
		image: t.exposeString("image", { nullable: true }),
		note: t.exposeString("note", { nullable: true }),
		addedAt: t.expose("addedAt", { type: "DateTime" }),
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
		tags: t.relation("tags"),
	}),
});

builder.queryField("bookmark", t =>
	t.prismaField({
		authScopes: { user: true },
		type: "Bookmark",
		args: { id: t.arg.string({ required: true }) },
		resolve: async (query, _root, { id }, { user }) => {
			return db.bookmark.findFirst({
				...query,
				where: { id, userId: user!.id },
				rejectOnNotFound: true,
			});
		},
	})
);

const BookmarksFilterInput = builder.inputType("BookmarksFilterInput", {
	fields: t => ({
		query: t.string(),
		liked: t.boolean({ defaultValue: undefined }),
		archived: t.boolean({ defaultValue: undefined }),
	}),
});

const BookmarksSortOrderEnum = builder.enumType("BookmarksSortOrderEnum", {
	values: ["addedAt", "likedAt", "archivedAt"] as const,
});

builder.queryField("bookmarks", t =>
	t.prismaConnection({
		authScopes: { user: true },
		type: "Bookmark",
		cursor: "id",
		defaultSize: 25,
		maxSize: 100,
		nodeNullable: false,
		edgesNullable: false,
		args: {
			filter: t.arg({ type: BookmarksFilterInput }),
			sort: t.arg({
				type: BookmarksSortOrderEnum,
				required: true,
				defaultValue: "addedAt",
			}),
			oldestFirst: t.arg.boolean({ defaultValue: false }),
			tag: t.arg.string(),
		},
		resolve: async (
			query,
			_root,
			{ filter, oldestFirst, sort, tag },
			{ user }
		) => {
			const sortOrder = oldestFirst ? "asc" : "desc";

			// TODO: how to make this less ugly?
			const filterToQueryOption = (filter: boolean | undefined | null) =>
				filter != null
					? { [filter ? "not" : "equals"]: null }
					: undefined;

			const tsquerySpecialChars = /[()|&:*!]/g;
			const queryStringToPostgresOperators = (query: string) =>
				query
					.replace(tsquerySpecialChars, " ")
					.trim()
					.split(/\s+/)
					.join(" & ");

			const searchQuery = filter?.query
				? queryStringToPostgresOperators(filter.query)
				: null;

			return db.bookmark.findMany({
				...query,
				where: {
					userId: user!.id,
					...(searchQuery && {
						title: { search: searchQuery },
						note: { search: searchQuery },
					}),
					likedAt: filterToQueryOption(filter?.liked),
					archivedAt: filterToQueryOption(filter?.archived),
					...(tag && { tags: { some: { name: tag } } }),
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
			validate: { schema: bookmarkUrlSchema },
		}),
		title: t.string({
			validate: { schema: bookmarkTitleSchema },
		}),
	}),
});

builder.mutationField("createBookmark", t =>
	t.prismaField({
		type: "Bookmark",
		authScopes: { user: true },
		args: {
			input: t.arg({ type: CreateBookmarkInput, required: true }),
		},
		resolve: async (query, _parent, { input }, { user }) => {
			input.url = cleanUrl(input.url);

			const metadata = await getPageMetadata(input.url);

			if (metadata.image) {
				metadata.image = await getThumbnailImage(metadata.image);
			}

			const title =
				input.title ?? metadata.title ?? getHostnameFromUrl(input.url);

			return db.bookmark.upsert({
				...query,
				where: { url_userId: { url: input.url, userId: user!.id } },
				create: {
					userId: user!.id,
					url: input.url,
					title,
					image: metadata.image,
				},
				// move bookmark to the top of the reading list if it already exists
				update: {
					title,
					image: metadata.image ?? undefined,
					addedAt: new Date(),
					archivedAt: null,
				},
			});
		},
	})
);

const UpdateBookmarkInput = builder.inputType("UpdateBookmarkInput", {
	fields: t => ({
		title: t.string({
			validate: { schema: bookmarkTitleSchema },
		}),
		note: t.string({
			validate: { schema: bookmarkNoteSchema },
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
			input: t.arg({ type: UpdateBookmarkInput, required: true }),
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
					title: input.title ?? undefined,
					note: input.note ?? undefined,
					addedAt: input.archived === false ? new Date() : undefined,
					likedAt: inputToDateValue(input.liked ?? undefined),
					archivedAt: inputToDateValue(input.archived ?? undefined),
				},
			});
		},
	})
);

const UpdateBookmarkTagsInput = builder.inputType("UpdateBookmarkTagsInput", {
	fields: t => ({
		tags: t.stringList({
			required: true,
			validate: {
				schema: z.array(tagNameSchema),
				refine: [
					values => new Set(values).size === values.length,
					{ message: "All tags must be unique" },
				],
			},
		}),
	}),
});

builder.mutationField("updateBookmarkTags", t =>
	t.prismaField({
		type: "Bookmark",
		authScopes: { user: true },
		args: {
			id: t.arg.string({ required: true }),
			input: t.arg({
				type: UpdateBookmarkTagsInput,
				required: true,
			}),
		},
		resolve: async (query, _parent, { id, input }, { user }) => {
			const tagNames = input.tags.map(tag => tag.toLocaleLowerCase());
			const tagNamesSet = new Set(tagNames);

			const existingTags = await db.bookmark
				.findUnique({
					where: { id },
					rejectOnNotFound: true,
				})
				.tags();
			const existingTagNames = existingTags.map(tag => tag.name);
			const existingTagNamesSet = new Set(existingTagNames);

			const newTagNames = tagNames.filter(
				tag => !existingTagNamesSet.has(tag)
			);

			const tagNamesToDelete = existingTagNames.filter(
				name => !tagNamesSet.has(name)
			);

			return db.bookmark.update({
				...query,
				where: { id },
				data: {
					tags: {
						connectOrCreate: newTagNames.map(tag => ({
							create: {
								name: tag,
								userId: user!.id,
							},
							where: {
								name_userId: {
									name: tag,
									userId: user!.id,
								},
							},
						})),
						disconnect: tagNamesToDelete.map(tag => ({
							name_userId: { name: tag, userId: user!.id },
						})),
					},
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
