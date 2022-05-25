import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { BookmarkSortingSettings } from "@/components/BookmarksList/BookmarksSortingSettings";
import { HeaderPortal } from "@/components/Header";
import { DeleteTagButton } from "@/components/Tag/DeleteTagButton";
import { PinTagButton } from "@/components/Tag/PinTagButton";
import { Tooltip } from "@/components/Tooltip";
import { TooltipLabel } from "@/components/Tooltip/TooltipLabel";
import { useAutoHotkeys } from "@/hooks/useAutoHotkeys";
import {
	GetBookmarksWithTagQuery,
	GetBookmarksWithTagQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Button, Center, HStack, Spacer, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";

export default function BookmarksWithTagPage() {
	const router = useRouter();
	const tag = router.query.tag as string;

	const [oldestFirst, setOldestFirst] = useState(false);

	const actionsRef = useRef<HTMLDivElement | null>(null);
	useAutoHotkeys({ ref: document.body, scopeRef: actionsRef });

	const { data, loading, fetchMore } = useQuery<
		GetBookmarksWithTagQuery,
		GetBookmarksWithTagQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetBookmarksWithTag(
				$cursor: String
				$tag: String!
				$oldestFirst: Boolean!
			) {
				bookmarks(
					tag: $tag
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
			variables: { tag, oldestFirst },
			skip: !tag,
			notifyOnNetworkStatusChange: true,
		}
	);

	function handleFetchMore() {
		if (data) {
			fetchMore({
				variables: {
					cursor: data.bookmarks.pageInfo.endCursor,
				},
			});
		}
	}

	const bookmarks = useMemo(
		() => data?.bookmarks.edges.map(b => b.node),
		[data?.bookmarks]
	);

	return (
		<>
			{tag && (
				<HeaderPortal>
					<Box>{tag}</Box>

					<HStack spacing={{ base: "2", md: "0.5" }} ref={actionsRef}>
						<Tooltip
							label={<TooltipLabel text="Pin tag" hotkey="P" />}
						>
							<PinTagButton tag={tag} data-hotkey="p" />
						</Tooltip>
						<Tooltip
							label={
								<TooltipLabel text="Delete tag" hotkey="D" />
							}
						>
							<DeleteTagButton
								tag={tag}
								data-hotkey="d"
								afterDelete={() => router.replace("/tags")}
							/>
						</Tooltip>
					</HStack>

					<Spacer />

					<BookmarkSortingSettings
						oldestFirst={oldestFirst}
						onChangeOldestFirst={setOldestFirst}
					/>
				</HeaderPortal>
			)}

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
