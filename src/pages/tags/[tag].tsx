import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { Header } from "@/components/Header";
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
	HStack,
	IconButton,
	Spinner,
	Text,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { AiFillPushpin, AiOutlinePushpin } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";

export default function BookmarksWithTagPage() {
	const router = useRouter();
	const tag = router.query.tag as string;

	const { isTagPinned, pinTag, unpinTag } = usePinnedTagsStore();
	const isPinned = tag && isTagPinned(tag);

	const { data } = useQuery<
		GetBookmarksWithTagQuery,
		GetBookmarksWithTagQueryVariables
	>(
		gql`
			${BookmarksList_bookmarkFragment}

			query GetBookmarksWithTag($tag: String!) {
				bookmarks(tag: $tag) {
					id
					...BookmarksList_bookmark
				}
			}
		`,
		{ variables: { tag }, skip: !tag, fetchPolicy: "cache-and-network" }
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
			<Header>
				<Box>
					{tag}{" "}
					{data?.bookmarks?.length !== undefined &&
						`(${data.bookmarks.length})`}
				</Box>
			</Header>

			<HStack my="2" fontWeight="semibold">
				<Text>{tag}</Text>
				<IconButton
					icon={isPinned ? <AiFillPushpin /> : <AiOutlinePushpin />}
					onClick={onTogglePin}
					title={isPinned ? "Unpin tag" : "Pin tag"}
					aria-label={isPinned ? "Unpin tag" : "Pin tag"}
				/>
				<IconButton
					icon={<HiOutlineTrash />}
					onClick={onDelete}
					title="Delete tag"
					aria-label="Delete tag"
				/>
			</HStack>
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
