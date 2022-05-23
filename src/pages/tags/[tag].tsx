import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { BookmarkSortingSettings } from "@/components/BookmarksList/BookmarksSortingSettings";
import { HeaderPortal } from "@/components/Header";
import { Tooltip } from "@/components/Tooltip";
import { TooltipLabel } from "@/components/Tooltip/TooltipLabel";
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
	Center,
	Icon,
	IconButton,
	Spacer,
	Spinner,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillPushpin, AiOutlinePushpin } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";

export default function BookmarksWithTagPage() {
	const router = useRouter();
	const tag = router.query.tag as string;

	const [oldestFirst, setOldestFirst] = useState(false);

	const { isTagPinned, pinTag, unpinTag } = usePinnedTagsStore();
	const isPinned = tag && isTagPinned(tag);

	const { data } = useQuery<
		GetBookmarksWithTagQuery,
		GetBookmarksWithTagQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetBookmarksWithTag($tag: String!, $oldestFirst: Boolean!) {
				bookmarks(tag: $tag, oldestFirst: $oldestFirst) {
					id
					...BookmarksList_bookmark
				}
			}
		`,
		{
			variables: { tag, oldestFirst },
			skip: !tag,
			fetchPolicy: "cache-and-network",
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

	function onTogglePin() {
		if (isPinned) {
			unpinTag(tag);
		} else {
			pinTag(tag);
		}
	}

	function onDelete() {
		mutateDelete();
	}

	return (
		<>
			{tag && (
				<HeaderPortal>
					<Box>
						{tag}{" "}
						{data?.bookmarks?.length !== undefined &&
							`(${data.bookmarks.length})`}
					</Box>

					<Tooltip label={<TooltipLabel text="Pin tag" />}>
						<IconButton
							icon={
								<Icon
									as={
										isPinned
											? AiFillPushpin
											: AiOutlinePushpin
									}
									boxSize="5"
								/>
							}
							variant="ghost"
							size="sm"
							aria-label={isPinned ? "Unpin tag" : "Pin tag"}
							onClick={onTogglePin}
						/>
					</Tooltip>
					<Tooltip label={<TooltipLabel text="Delete tag" />}>
						<IconButton
							icon={<Icon as={HiOutlineTrash} boxSize="5" />}
							variant="ghost"
							size="sm"
							aria-label="Delete tag"
							onClick={onDelete}
						/>
					</Tooltip>

					<Spacer />

					<BookmarkSortingSettings
						oldestFirst={oldestFirst}
						onChangeOldestFirst={setOldestFirst}
					/>
				</HeaderPortal>
			)}

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
