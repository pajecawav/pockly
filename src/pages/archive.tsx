import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { Header } from "@/components/Header";
import {
	GetArchivedBookmarksQuery,
	GetArchivedBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo } from "react";

export default function ArchivedBookmarksPage() {
	const { data } = useQuery<
		GetArchivedBookmarksQuery,
		GetArchivedBookmarksQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetArchivedBookmarks {
				bookmarks(filter: { archived: true }, sort: archivedAt) {
					id
					...BookmarksList_bookmark
				}
			}
		`,
		{ fetchPolicy: "cache-and-network" }
	);

	const bookmarks = useMemo(
		() => data?.bookmarks.filter(bookmark => bookmark.archived),
		[data?.bookmarks]
	);

	return (
		<>
			<Header>
				<Box>
					Archive{" "}
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
