import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { BookmarkSortingSettings } from "@/components/BookmarksList/BookmarksSortingSettings";
import { HeaderPortal } from "@/components/Header";
import {
	GetUnreadBookmarksQuery,
	GetUnreadBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Spacer, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo, useState } from "react";

// TODO: figure out how to remove bolierplate

export default function ReadingListPage() {
	const [oldestFirst, setOldestFirst] = useState(false);

	const { data } = useQuery<
		GetUnreadBookmarksQuery,
		GetUnreadBookmarksQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetUnreadBookmarks($oldestFirst: Boolean!) {
				bookmarks(
					filter: { archived: false }
					sort: addedAt
					oldestFirst: $oldestFirst
				) {
					id
					...BookmarksList_bookmark
				}
			}
		`,
		{ fetchPolicy: "cache-and-network", variables: { oldestFirst } }
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

				<Spacer />

				<BookmarkSortingSettings
					oldestFirst={oldestFirst}
					onChangeOldestFirst={setOldestFirst}
				/>
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
