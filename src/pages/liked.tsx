import { BookmarksList } from "@/components/BookmarksList";
import { Header } from "@/components/Header";
import {
	GetLikedBookmarksQuery,
	GetLikedBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";

export default function LikedBookmarksPage() {
	const { data } = useQuery<
		GetLikedBookmarksQuery,
		GetLikedBookmarksQueryVariables
	>(
		gql`
			${BookmarksList.fragments.bookmark}

			query GetLikedBookmarks {
				bookmarks(filter: { liked: true }) {
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
					Liked Bookmarks{" "}
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
