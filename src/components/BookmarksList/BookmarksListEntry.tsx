import { getHostnameFromUrl } from "@/utils";
import {
	BookmarksListEntry_BookmarkFragment,
	namedOperations,
	UpdateBookmarkMutation,
	UpdateBookmarkMutationVariables,
	UpdateBookmarkMutation_BookmarkFragment,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import {
	Icon,
	IconButton,
	Link,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import NextLink from "next/link";
import {
	HiOutlineAnnotation,
	HiOutlineArchive,
	HiOutlineHeart,
	HiOutlinePlus,
	HiOutlineTag,
	HiOutlineTrash,
} from "react-icons/hi";
import { FilledIcon } from "../FilledIcon";
import { BookmarkImage } from "./BookmarkImage";

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
			optimisticResponse: vars => ({
				updateBookmark: {
					id: bookmark.id,
					__typename: "Bookmark",
					liked: vars.input.liked ?? bookmark.liked,
					archived: vars.input.archived ?? bookmark.archived,
				},
			}),
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
			<Stack
				direction={{ base: "row-reverse", sm: "row" }}
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

				<Link
					href={bookmark.url}
					isExternal
					flex="1"
					w="0"
					wordBreak="break-word"
				>
					<Text as="div" isTruncated title={bookmark.title}>
						{bookmark.title}
					</Text>{" "}
					<Text as="div" color="lightslategray">
						{getHostnameFromUrl(bookmark.url)}
					</Text>
				</Link>
			</Stack>

			<Stack direction="row" spacing="1.5" alignItems="center">
				<NextLink href={`/b/${bookmark.id}`} passHref>
					<Link display="block">
						{/* TODO: better icon */}
						<Icon as={HiOutlineAnnotation} boxSize="6" />
					</Link>
				</NextLink>
				<IconButton
					icon={
						<FilledIcon
							as={HiOutlineHeart}
							boxSize="6"
							filled={bookmark.liked}
						/>
					}
					title="Toggle liked"
					aria-label="Toggle liked"
					onClick={onToggleLiked}
				/>
				<IconButton
					icon={
						<Icon
							as={
								bookmark.archived
									? HiOutlinePlus
									: HiOutlineArchive
							}
							boxSize="6"
						/>
					}
					title={
						bookmark.archived
							? "Add to reading list"
							: "Move to archive"
					}
					aria-label={
						bookmark.archived
							? "Add to reading list"
							: "Move to archive"
					}
					onClick={onToggleArchived}
				/>
				<IconButton
					icon={<Icon as={HiOutlineTag} boxSize="6" />}
					title="Edit tags"
					aria-label="Edit tags"
					onClick={onEditTags}
				/>
				<IconButton
					icon={<Icon as={HiOutlineTrash} boxSize="6" />}
					title="Delete bookmark"
					aria-label="Delete bookmark"
					onClick={onDelete}
				/>
			</Stack>
		</Stack>
	);
}
