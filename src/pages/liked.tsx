import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { Header } from "@/components/Header";
import {
	GetLikedBookmarksQuery,
	GetLikedBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo } from "react";

export default function LikedBookmarksPage() {
	const { data } = useQuery<
		GetLikedBookmarksQuery,
		GetLikedBookmarksQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetLikedBookmarks {
				bookmarks(filter: { liked: true }, sort: likedAt) {
					id
					...BookmarksList_bookmark
				}
			}
		`,
		{ fetchPolicy: "cache-and-network" }
	);

	const bookmarks = useMemo(
		() => data?.bookmarks.filter(bookmark => bookmark.liked),
		[data?.bookmarks]
	);

	return (
		<>
			<Header>
				<Box>
					Liked Bookmarks{" "}
					{bookmarks?.length !== undefined && `(${bookmarks.length})`}
				</Box>
			</Header>
			{!bookmarks ? (
				<Center w="full" h="32">
					<Spinner />
				</Center>
			) : (
				<BookmarksList bookmarks={bookmarks} />
			)}
		</>
	);
}
