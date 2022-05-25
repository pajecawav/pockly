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
import { Box, Button, Center, Spacer, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo, useState } from "react";

// TODO: figure out how to replace boilerplate

export default function ReadingListPage() {
	const [oldestFirst, setOldestFirst] = useState(false);

	const { data, loading, fetchMore } = useQuery<
		GetUnreadBookmarksQuery,
		GetUnreadBookmarksQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetUnreadBookmarks($cursor: String, $oldestFirst: Boolean!) {
				bookmarks(
					filter: { archived: false }
					sort: addedAt
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
			// TODO: with `fetchPolicy` new query result completely replaces old
			// paginated one
			// fetchPolicy: "cache-and-network",
			variables: { oldestFirst },
			notifyOnNetworkStatusChange: true,
		}
	);

	const bookmarks = useMemo(
		() =>
			data?.bookmarks.edges
				.map(b => b.node)
				.filter(bookmark => bookmark.archived === false),
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
				<Box>Reading List</Box>

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
