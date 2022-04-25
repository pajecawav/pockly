import {
	BookmarksListEntry_BookmarkFragment,
	DeleteBookmarkMutation,
	DeleteBookmarkMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { Stack } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useState } from "react";
import { BookmarksListEntry } from "./BookmarksListEntry";
import { DeleteBookmarkConfirmationModal } from "./DeleteBookmarkConfirmationModal";
import { EmptyBookmarks } from "./EmptyBookmarks";

interface Props {
	bookmarks: BookmarksListEntry_BookmarkFragment[];
}

export function BookmarksList({ bookmarks }: Props) {
	const [deletingBookmark, setDeletingBookmark] =
		useState<BookmarksListEntry_BookmarkFragment | null>(null);

	const [mutateDelete, { loading: isDeleting }] = useMutation<
		DeleteBookmarkMutation,
		DeleteBookmarkMutationVariables
	>(
		gql`
			mutation DeleteBookmark($id: String!) {
				deleteBookmark(id: $id) {
					id
				}
			}
		`,
		{
			optimisticResponse: vars => ({ deleteBookmark: { id: vars.id } }),
			onCompleted: () => setDeletingBookmark(null),
			update: (cache, result) => {
				if (result.data?.deleteBookmark) {
					cache.evict({
						id: cache.identify(result.data.deleteBookmark),
					});
				}
			},
		}
	);

	return (
		<>
			<Stack direction="column" spacing="0">
				{bookmarks.length ? (
					bookmarks.map(bookmark => (
						<BookmarksListEntry
							key={bookmark.id}
							bookmark={bookmark}
							onDelete={() => setDeletingBookmark(bookmark)}
						/>
					))
				) : (
					<EmptyBookmarks />
				)}
			</Stack>

			<DeleteBookmarkConfirmationModal
				isOpen={!!deletingBookmark}
				isDeleting={isDeleting}
				onClose={() => setDeletingBookmark(null)}
				onConfirm={() => {
					if (deletingBookmark) {
						mutateDelete({
							variables: { id: deletingBookmark.id },
						});
					}
				}}
			/>
		</>
	);
}

BookmarksList.fragments = {
	bookmark: BookmarksListEntry.fragments.bookmark,
};
