import { BookmarksList } from "@/components/BookmarksList";
import { Header } from "@/components/Header";
import {
	GetUnreadBookmarksQuery,
	GetUnreadBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";

export default function ReadingListPage() {
	const { data } = useQuery<
		GetUnreadBookmarksQuery,
		GetUnreadBookmarksQueryVariables
	>(
		gql`
			${BookmarksList.fragments.bookmark}

			query GetUnreadBookmarks {
				bookmarks(filter: { archived: false }, sort: addedAt) {
					id
					...BookmarksListEntry_bookmark
				}
			}
		`
	);

	return (
		<>
			<Header>
				<Box>
					Reading List{" "}
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
