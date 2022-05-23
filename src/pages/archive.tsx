import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { BookmarkSortingSettings } from "@/components/BookmarksList/BookmarksSortingSettings";
import { HeaderPortal } from "@/components/Header";
import {
	GetArchivedBookmarksQuery,
	GetArchivedBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Spacer, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo, useState } from "react";

export default function ArchivedBookmarksPage() {
	const [oldestFirst, setOldestFirst] = useState(false);

	const { data } = useQuery<
		GetArchivedBookmarksQuery,
		GetArchivedBookmarksQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetArchivedBookmarks($oldestFirst: Boolean!) {
				bookmarks(
					filter: { archived: true }
					sort: archivedAt
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
		() => data?.bookmarks.filter(bookmark => bookmark.archived),
		[data?.bookmarks]
	);

	return (
		<>
			<HeaderPortal>
				<Box>
					Archive{" "}
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
