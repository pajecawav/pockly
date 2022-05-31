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
import { isNetworkRequestInFlight } from "@apollo/client/core/networkStatus";
import { Box, Center, Spacer, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo, useState } from "react";
import { Waypoint } from "react-waypoint";

// TODO: figure out how to replace boilerplate

export default function ReadingListPage() {
	const [oldestFirst, setOldestFirst] = useState(false);

	const { data, fetchMore, networkStatus } = useQuery<
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
		() => data?.bookmarks.edges.map(b => b.node),
		[data?.bookmarks]
	);

	const handleFetchMore = () => {
		if (!data || isNetworkRequestInFlight(networkStatus)) return;

		fetchMore({
			variables: {
				cursor: data.bookmarks.pageInfo.endCursor,
			},
		});
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
				<Waypoint onEnter={handleFetchMore} bottomOffset={-200}>
					<Center mt="2" h="10">
						<Spinner />
					</Center>
				</Waypoint>
			)}
		</>
	);
}
