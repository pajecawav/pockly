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
		`
	);

	return (
		<>
			<Header>
				<Box>
					Archived Bookmarks{" "}
					{data?.bookmarks?.length !== undefined &&
						`(${data.bookmarks.length})`}
				</Box>
			</Header>
			{!data ? (
				<Center w="full" h="32">
					<Spinner />
				</Center>
			) : (
				<BookmarksList bookmarks={data.bookmarks} />
			)}
		</>
	);
}
