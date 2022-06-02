import { BookmarksListEntry_bookmarkFragment } from "@/components/BookmarksList/BookmarksListEntry";
import {
	GetLikedBookmarksDocument,
	ToggleLikedBookmarkButtonMutation,
	ToggleLikedBookmarkButtonMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { forwardRef } from "react";
import { HiOutlineHeart } from "react-icons/hi";
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
	liked: boolean;
}

export const ToggleLikedBookmarkButton = forwardRef<HTMLButtonElement, Props>(
	function ToggleLikedBookmarkButton({ id, liked, ...props }, ref) {
		const [mutate] = useMutation<
			ToggleLikedBookmarkButtonMutation,
			ToggleLikedBookmarkButtonMutationVariables
		>(
			gql`
				${BookmarksListEntry_bookmarkFragment}

				mutation ToggleLikedBookmarkButtonMutation(
					$id: String!
					$liked: Boolean!
				) {
					updateBookmark(id: $id, input: { liked: $liked }) {
						id
						liked
						__typename
						...BookmarksListEntry_bookmark
					}
				}
			`,
			{
				update: (cache, response) => {
					const updatedBookmark = response.data?.updateBookmark;

					if (!updatedBookmark) return;

					cache.updateQuery(
						{
							query: GetLikedBookmarksDocument,
							// TODO: also handle `oldestFirst=true`?
							variables: { oldestFirst: false },
						},
						data => {
							if (!data) return data;

							const bookmarks = data.bookmarks;
							let edges;
							if (updatedBookmark.liked) {
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
				},
			}
		);

		function handleClick() {
			mutate({
				variables: {
					id,
					liked: !liked,
				},
			});
		}

		return (
			<BookmarkActionButton
				{...props}
				icon={HiOutlineHeart}
				filled={liked}
				aria-label="Toggle liked"
				onClick={handleClick}
				ref={ref}
			/>
		);
	}
);
