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
import { Box, Button, Center, Spacer, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo, useState } from "react";

export default function ArchivedBookmarksPage() {
	const [oldestFirst, setOldestFirst] = useState(false);

	const { data, loading, fetchMore } = useQuery<
		GetArchivedBookmarksQuery,
		GetArchivedBookmarksQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetArchivedBookmarks(
				$cursor: String
				$oldestFirst: Boolean!
			) {
				bookmarks(
					filter: { archived: true }
					sort: archivedAt
					oldestFirst: $oldestFirst
					after: $cursor
				) {
					edges {
						node {
							id
							...BookmarksList_bookmark
						}
					}
					pageInfo {
						endCursor
						hasNextPage
					}
				}
			}
		`,
		{
			// TODO: fix refetching
			// fetchPolicy: "cache-and-network",
			variables: { oldestFirst },
			notifyOnNetworkStatusChange: true,
		}
	);

	const bookmarks = useMemo(
		() => data?.bookmarks.edges.map(b => b.node),
		[data?.bookmarks]
	);

	const handleFetchMore = () => {
		if (data) {
			fetchMore({
				variables: {
					cursor: data.bookmarks.pageInfo.endCursor,
				},
			});
		}
	};
	return (
		<>
			<HeaderPortal>
				<Box>Archive</Box>

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

			{data?.bookmarks.pageInfo.hasNextPage && (
				<Center mt="2">
					<Button isLoading={loading} onClick={handleFetchMore}>
						Load more
					</Button>
				</Center>
			)}
		</>
	);
}
