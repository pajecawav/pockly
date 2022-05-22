import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { HeaderPortal } from "@/components/Header";
import {
	GetUnreadBookmarksQuery,
	GetUnreadBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo } from "react";

export default function ReadingListPage() {
	const { data } = useQuery<
		GetUnreadBookmarksQuery,
		GetUnreadBookmarksQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetUnreadBookmarks {
				bookmarks(filter: { archived: false }, sort: addedAt) {
					id
					...BookmarksList_bookmark
				}
			}
		`,
		{ fetchPolicy: "cache-and-network" }
	);

	const bookmarks = useMemo(
		() => data?.bookmarks.filter(bookmark => bookmark.archived === false),
		[data?.bookmarks]
	);

	return (
		<>
			<HeaderPortal>
				<Box>
					Reading List{" "}
					{bookmarks?.length !== undefined && `(${bookmarks.length})`}
				</Box>
			</HeaderPortal>

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
