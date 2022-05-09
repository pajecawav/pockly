import {
	BookmarksList_BookmarkFragment,
	DeleteBookmarkMutation,
	DeleteBookmarkMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { Stack, useToast } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useEffect, useRef, useState } from "react";
import {
	BookmarksListEntry,
	BookmarksListEntry_bookmarkFragment,
} from "./BookmarksListEntry";
import { DeleteBookmarkConfirmationModal } from "./DeleteBookmarkConfirmationModal";
import {
	EditBookmarkTagsModal,
	EditBookmarkTagsModal_bookmarkFragment,
} from "./EditBookmarkTagsModal";
import { EmptyBookmarks } from "./EmptyBookmarks";
import { useListFocusHotkeys } from "./useListFocusHotkeys";

interface Props {
	bookmarks: BookmarksList_BookmarkFragment[];
}

export const BookmarksList_bookmarkFragment = gql`
	${BookmarksListEntry_bookmarkFragment}
	${EditBookmarkTagsModal_bookmarkFragment}

	fragment BookmarksList_bookmark on Bookmark {
		...BookmarksListEntry_bookmark
		...EditBookmarkTagsModal_bookmark
	}
`;

export function BookmarksList({ bookmarks }: Props) {
	const toast = useToast();

	const [deletingBookmark, setDeletingBookmark] =
		useState<BookmarksList_BookmarkFragment | null>(null);
	const [editingTagsBookmark, setEditingTagsBookmark] =
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
		setEditingTagsBookmark(null);
	};

	const ref = useRef<HTMLDivElement | null>(null);
	const { reset: resetFocusState } = useListFocusHotkeys({ ref });
	useEffect(() => {
		resetFocusState();
	}, [bookmarks, resetFocusState]);

	return (
		<>
			<Stack direction="column" spacing="0" mt="2" ref={ref}>
				{bookmarks.length ? (
					bookmarks.map(bookmark => (
						<BookmarksListEntry
							key={bookmark.id}
							bookmark={bookmark}
							onDelete={() => setDeletingBookmark(bookmark)}
							onEditTags={() => setEditingTagsBookmark(bookmark)}
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

			<EditBookmarkTagsModal
				bookmark={editingTagsBookmark}
				onClose={reset}
			/>
		</>
	);
}
