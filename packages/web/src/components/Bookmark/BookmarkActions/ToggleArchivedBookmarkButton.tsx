import { BookmarksListEntry_bookmarkFragment } from "@/components/BookmarksList/BookmarksListEntry";
import {
	GetArchivedBookmarksDocument,
	GetUnreadBookmarksDocument,
	ToggleArchivedBookmarkButtonMutation,
	ToggleArchivedBookmarkButtonMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import gql from "graphql-tag";
import { forwardRef } from "react";
import { HiOutlineArchive, HiOutlinePlus } from "react-icons/hi";
import {
	BookmarkActionButton,
	BookmarkActionButtonProps,
} from "./BookmarkActionButton";

interface Props
	extends Omit<
		BookmarkActionButtonProps,
		"icon" | "filled" | "onClick" | "aria-label"
	> {
	id: string;
	archived: boolean;
}

export const ToggleArchivedBookmarkButton = forwardRef<
	HTMLButtonElement,
	Props
>(function ToggleArchivedBookmarkButton({ id, archived, ...props }, ref) {
	const toast = useToast();

	const [mutate] = useMutation<
		ToggleArchivedBookmarkButtonMutation,
		ToggleArchivedBookmarkButtonMutationVariables
	>(
		gql`
			${BookmarksListEntry_bookmarkFragment}

			mutation ToggleArchivedBookmarkButtonMutation(
				$id: String!
				$archived: Boolean!
			) {
				updateBookmark(id: $id, input: { archived: $archived }) {
					id
					archived
					__typename
					...BookmarksListEntry_bookmark
				}
			}
		`,
		{
			onCompleted: result => {
				const wasArchived = result.updateBookmark.archived;
				toast({
					status: "success",
					description: wasArchived
						? "Archived bookmark!"
						: "Added to reading list!",
				});
			},
			update: (cache, response) => {
				const updatedBookmark = response.data?.updateBookmark;

				if (!updatedBookmark) return;

				// TODO: too much boilerplate
				cache.updateQuery(
					{
						query: GetArchivedBookmarksDocument,
						// TODO: also handle `oldestFirst=true`?
						variables: { oldestFirst: false },
					},
					data => {
						if (!data) return data;

						const bookmarks = data.bookmarks;
						let edges;
						if (updatedBookmark.archived) {
							edges = [
								{ node: updatedBookmark },
								...bookmarks.edges,
							];
						} else {
							edges = bookmarks.edges.filter(
								edge => edge.node.id !== updatedBookmark.id
							);
						}

						return {
							...data,
							bookmarks: { ...bookmarks, edges },
						};
					}
				);

				cache.updateQuery(
					{
						query: GetUnreadBookmarksDocument,
						// TODO: also handle `oldestFirst=true`?
						variables: { oldestFirst: false },
					},
					data => {
						if (!data) return data;

						const bookmarks = data.bookmarks;
						let edges;
						if (updatedBookmark.archived) {
							edges = bookmarks.edges.filter(
								edge => edge.node.id !== updatedBookmark.id
							);
						} else {
							edges = [
								{ node: updatedBookmark },
								...bookmarks.edges,
							];
						}

						return {
							...data,
							bookmarks: { ...bookmarks, edges },
						};
					}
				);
			},
		}
	);

	function handleClick() {
		mutate({
			variables: {
				id,
				archived: !archived,
			},
		});
	}

	return (
		<BookmarkActionButton
			{...props}
			icon={archived ? HiOutlinePlus : HiOutlineArchive}
			aria-label={archived ? "Add to reading list" : "Move to archive"}
			onClick={handleClick}
			ref={ref}
		/>
	);
});
