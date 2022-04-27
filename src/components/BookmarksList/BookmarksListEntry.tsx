import { getHostnameFromUrl } from "@/utils";
import {
	BookmarksListEntry_BookmarkFragment,
	namedOperations,
	UpdateBookmarkMutation,
	UpdateBookmarkMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { HStack, Icon, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { ArchiveIcon, HeartIcon, TrashIcon } from "@heroicons/react/outline";
import gql from "graphql-tag";
import { FilledIcon } from "../FilledIcon";
import { BookmarkImage } from "./BookmarkImage";

interface Props {
	bookmark: BookmarksListEntry_BookmarkFragment;
	onDelete: () => void;
}

const BookmarksListEntry_bookmarkFragment = gql`
	fragment BookmarksListEntry_bookmark on Bookmark {
		id
		title
		liked
		archived
		url
		addedAt
		image
	}
`;

export function BookmarksListEntry({ bookmark, onDelete }: Props) {
	const [mutateUpdate] = useMutation<
		UpdateBookmarkMutation,
		UpdateBookmarkMutationVariables
	>(
		gql`
			mutation UpdateBookmark(
				$id: String!
				$input: UpdateBookmarkInput!
			) {
				updateBookmark(id: $id, input: $input) {
					id
					liked
					archived
				}
			}
		`,
		{
			optimisticResponse: vars => ({
				updateBookmark: {
					id: bookmark.id,
					liked: vars.input.liked ?? bookmark.liked,
					archived: vars.input.archived ?? bookmark.archived,
				},
			}),
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

	const onMoveToArchive = () => {
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
		});
	};

	return (
		<Stack
			direction={{ base: "column", sm: "row" }}
			alignItems={{ sm: "center" }}
			py="1.5"
			pr="2"
			spacing="4"
			borderBottom="1px"
			borderColor="gray.100"
			_dark={{ borderColor: "gray.700" }}
		>
			<Link href={bookmark.url} isExternal>
				<BookmarkImage title={bookmark.title} src={bookmark.image} />
			</Link>

			<Link
				href={bookmark.url}
				isExternal
				flex="1"
				w={{ base: "auto", sm: "0" }}
				wordBreak="break-word"
			>
				<Text as="div" isTruncated title={bookmark.title}>
					{bookmark.title}
				</Text>{" "}
				<Text as="div" color="lightslategray">
					{getHostnameFromUrl(bookmark.url)}
				</Text>
			</Link>

			<HStack spacing="1">
				<IconButton
					size="sm"
					icon={
						<FilledIcon
							as={HeartIcon}
							boxSize="6"
							filled={bookmark.liked}
						/>
					}
					title="Toggle liked"
					aria-label="Toggle liked"
					onClick={onToggleLiked}
				/>
				<IconButton
					size="sm"
					icon={
						<FilledIcon
							as={ArchiveIcon}
							boxSize="6"
							filled={bookmark.archived}
						/>
					}
					title="Move to archive"
					aria-label="Move to archive"
					onClick={onMoveToArchive}
				/>
				<IconButton
					size="sm"
					icon={<Icon as={TrashIcon} boxSize="6" />}
					title="Delete bookmark"
					aria-label="Delete bookmark"
					onClick={onDelete}
				/>
			</HStack>
		</Stack>
	);
}

BookmarksListEntry.fragments = {
	bookmark: BookmarksListEntry_bookmarkFragment,
};
