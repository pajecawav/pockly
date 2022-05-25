import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { BookmarkSortingSettings } from "@/components/BookmarksList/BookmarksSortingSettings";
import { HeaderPortal } from "@/components/Header";
import { PinTagButton } from "@/components/Tag/PinTagButton";
import { Tooltip } from "@/components/Tooltip";
import { TooltipLabel } from "@/components/Tooltip/TooltipLabel";
import { useAutoHotkeys } from "@/hooks/useAutoHotkeys";
import { usePinnedTagsStore } from "@/stores/usePinnedTagsStore";
import {
	DeleteTagMutation,
	DeleteTagMutationVariables,
	GetBookmarksWithTagQuery,
	GetBookmarksWithTagQueryVariables,
} from "@/__generated__/operations";
import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	Button,
	Center,
	HStack,
	Icon,
	IconButton,
	Spacer,
	Spinner,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";

export default function BookmarksWithTagPage() {
	const router = useRouter();
	const tag = router.query.tag as string;

	const unpinTag = usePinnedTagsStore(store => store.unpinTag);

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

	const [mutateDelete] = useMutation<
		DeleteTagMutation,
		DeleteTagMutationVariables
	>(
		gql`
			mutation DeleteTagMutation($tag: String!) {
				deleteTag(tag: $tag) {
					id
					name
				}
			}
		`,
		{
			variables: { tag },
			onCompleted: () => {
				router.replace("/tags");
				unpinTag(tag);
			},
			update: (cache, response) => {
				const deletedTag = response.data?.deleteTag;
				if (deletedTag) {
					cache.evict({
						id: cache.identify(deletedTag),
					});
				}
			},
		}
	);

	function onDelete() {
		mutateDelete();
	}

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
							<IconButton
								icon={<Icon as={HiOutlineTrash} boxSize="5" />}
								variant="ghost"
								size="sm"
								data-hotkey="d"
								aria-label="Delete tag"
								onClick={onDelete}
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
