import {
	BookmarksList_BookmarkFragment,
	DeleteBookmarkMutation,
	DeleteBookmarkMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { Stack, useToast } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useCallback, useRef, useState } from "react";
import {
	BookmarksListEntry,
	BookmarksListEntry_bookmarkFragment,
} from "./BookmarksListEntry";
import { DeleteBookmarkConfirmationModal } from "./DeleteBookmarkConfirmationModal";
import { EmptyBookmarks } from "./EmptyBookmarks";
import { useListFocusHotkeys } from "./useListFocusHotkeys";

interface Props {
	bookmarks: BookmarksList_BookmarkFragment[];
}

export const BookmarksList_bookmarkFragment = gql`
	${BookmarksListEntry_bookmarkFragment}

	fragment BookmarksList_bookmark on Bookmark {
		...BookmarksListEntry_bookmark
	}
`;

export function BookmarksList({ bookmarks }: Props) {
	const toast = useToast();

	const [deletingBookmark, setDeletingBookmark] =
		useState<BookmarksList_BookmarkFragment | null>(null);

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
			onCompleted: () => {
				setDeletingBookmark(null);
				toast({
					status: "success",
					description: "Deleted bookmark!",
				});
			},
			update: (cache, result) => {
				if (result.data?.deleteBookmark) {
					cache.evict({
						id: cache.identify(result.data.deleteBookmark),
					});
				}
			},
		}
	);

	const reset = () => {
		setDeletingBookmark(null);
	};

	const ref = useRef<HTMLDivElement | null>(null);
	useListFocusHotkeys({ ref });

	const onDelete = useCallback(
		(bookmark: BookmarksList_BookmarkFragment) =>
			setDeletingBookmark(bookmark),
		[]
	);

	return (
		<>
			<Stack direction="column" spacing="0" mt="2" ref={ref}>
				{bookmarks.length ? (
					bookmarks.map(bookmark => (
						<BookmarksListEntry
							key={bookmark.id}
							bookmark={bookmark}
							onDelete={onDelete}
						/>
					))
				) : (
					<EmptyBookmarks />
				)}
			</Stack>

			<DeleteBookmarkConfirmationModal
				isOpen={!!deletingBookmark}
				isDeleting={isDeleting}
				onClose={reset}
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
