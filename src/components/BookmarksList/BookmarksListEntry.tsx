import { useAutoHotkeys } from "@/hooks/useAutoHotkeys";
import { getHostnameFromUrl } from "@/utils";
import {
	BookmarksListEntry_BookmarkFragment,
	namedOperations,
	UpdateBookmarkMutation,
	UpdateBookmarkMutationVariables,
	UpdateBookmarkMutation_BookmarkFragment,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { Box, Flex, HStack, Link, Stack, useToast } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRef } from "react";
import { BookmarkImage } from "./BookmarkImage";
import { BookmarksListEntryActions } from "./BookmarkListEntryActions";
import { TagsList } from "./TagsList";

interface Props {
	bookmark: BookmarksListEntry_BookmarkFragment;
	onDelete: () => void;
	onEditTags: () => void;
}

export const BookmarksListEntry_bookmarkFragment = gql`
	fragment BookmarksListEntry_bookmark on Bookmark {
		id
		title
		liked
		archived
		url
		addedAt
		image
		tags {
			id
			name
		}
	}
`;

const UpdateBookmarkMutation_bookmarkFragment = gql`
	fragment UpdateBookmarkMutation_bookmark on Bookmark {
		liked
		archived
	}
`;

export function BookmarksListEntry({ bookmark, onEditTags, onDelete }: Props) {
	const toast = useToast();
	const ref = useRef<HTMLDivElement | null>(null);

	useAutoHotkeys({ ref });

	const [mutateUpdate] = useMutation<
		UpdateBookmarkMutation,
		UpdateBookmarkMutationVariables
	>(
		gql`
			${UpdateBookmarkMutation_bookmarkFragment}

			mutation UpdateBookmark(
				$id: String!
				$input: UpdateBookmarkInput!
			) {
				updateBookmark(id: $id, input: $input) {
					id
					__typename
					...UpdateBookmarkMutation_bookmark
				}
			}
		`,
		{
			optimisticResponse: vars => ({
				updateBookmark: {
					id: bookmark.id,
					__typename: "Bookmark",
					liked: vars.input.liked ?? bookmark.liked,
					archived: vars.input.archived ?? bookmark.archived,
				},
			}),
			update: (cache, response) => {
				if (response.data?.updateBookmark) {
					cache.writeFragment<UpdateBookmarkMutation_BookmarkFragment>(
						{
							id: cache.identify(bookmark),
							fragment: UpdateBookmarkMutation_bookmarkFragment,
							data: response.data.updateBookmark,
						}
					);
				}
			},
		}
	);

	const onToggleLiked = () => {
		mutateUpdate({
			variables: {
				id: bookmark.id,
				input: {
					liked: !bookmark.liked,
				},
			},
			// TODO: modify cached data instead of refetching
			refetchQueries: [namedOperations.Query.GetLikedBookmarks],
		});
	};

	const onToggleArchived = () => {
		mutateUpdate({
			variables: {
				id: bookmark.id,
				input: {
					archived: !bookmark.archived,
				},
			},
			// TODO: modify cached data instead of refetching
			refetchQueries: [
				namedOperations.Query.GetUnreadBookmarks,
				namedOperations.Query.GetArchivedBookmarks,
			],
			onCompleted: result => {
				const wasArchived = result.updateBookmark.archived;
				toast({
					status: "success",
					description: wasArchived
						? "Archived bookmark!"
						: "Added to reading list!",
				});
			},
		});
	};

	return (
		<Flex
			as="article"
			direction={{ base: "column", sm: "row" }}
			alignItems={{ sm: "start" }}
			flexWrap="wrap"
			position="relative"
			py="1.5"
			columnGap="4"
			rowGap="1"
			borderBottom="1px"
			borderColor="gray.100"
			_dark={{ borderColor: "gray.700" }}
			data-group=""
			data-focus-list-item
			ref={ref}
		>
			<Box
				zIndex="-1"
				position="absolute"
				inset="0"
				width="full"
				boxSizing="content-box"
				px="2"
				transform="translateX(-0.5rem)"
				borderRadius="lg"
				bg="gray.200"
				display="none"
				_groupFocusWithin={{ display: "block" }}
				_dark={{ bg: "gray.700" }}
			/>

			<Stack
				direction={{ base: "row-reverse", sm: "row" }}
				w="full"
				flex={1}
				alignItems="center"
				spacing="4"
			>
				<Link href={bookmark.url} isExternal>
					<BookmarkImage
						title={bookmark.title}
						src={bookmark.image}
					/>
				</Link>

				<Box flex="1" w="0">
					<Link
						href={bookmark.url}
						isExternal
						display="block"
						maxW="max-content"
						wordBreak="break-word"
						isTruncated
						title={bookmark.title}
						data-focus-list-target
						data-hotkey="o"
					>
						{bookmark.title}
					</Link>
					<Link
						href={bookmark.url}
						isExternal
						display="block"
						maxW="max-content"
						color="lightslategray"
						wordBreak="break-word"
						isTruncated
					>
						{getHostnameFromUrl(bookmark.url)}
					</Link>
				</Box>
			</Stack>

			<HStack
				direction="row"
				spacing="1.5"
				mt="1"
				alignItems="center"
				order={{ base: 3, sm: "initial" }}
			>
				<BookmarksListEntryActions
					id={bookmark.id}
					liked={bookmark.liked}
					archived={bookmark.archived}
					onToggleLiked={onToggleLiked}
					onToggleArchived={onToggleArchived}
					onEditTags={onEditTags}
					onDelete={onDelete}
				/>
			</HStack>

			{bookmark.tags.length !== 0 && (
				<Box w="full">
					<TagsList tags={bookmark.tags} />
				</Box>
			)}
		</Flex>
	);
}
