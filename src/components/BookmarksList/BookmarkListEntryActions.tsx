import {
	BookmarksListEntry_BookmarkFragment,
	namedOperations,
	UpdateBookmarkMutation,
	UpdateBookmarkMutationVariables,
	UpdateBookmarkMutation_BookmarkFragment,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { Icon, IconButton, Link, useToast } from "@chakra-ui/react";
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
import { Hotkey } from "../Hotkey";
import { Tooltip } from "../Tooltip";
import { TooltipLabel } from "../Tooltip/TooltipLabel";

interface Props {
	bookmark: BookmarksListEntry_BookmarkFragment;
	onEditTags: (bookmark: BookmarksListEntry_BookmarkFragment) => void;
	onDelete: (bookmark: BookmarksListEntry_BookmarkFragment) => void;
}

const UpdateBookmarkMutation_bookmarkFragment = gql`
	fragment UpdateBookmarkMutation_bookmark on Bookmark {
		liked
		archived
	}
`;

export function BookmarksListEntryActions({
	bookmark,
	onEditTags,
	onDelete,
}: Props) {
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
							id: cache.identify(response.data.updateBookmark),
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
		<>
			<Tooltip
				label={
					<TooltipLabel>
						Open notes &middot; <Hotkey value="N" />
					</TooltipLabel>
				}
			>
				<span>
					<NextLink href={`/b/${bookmark.id}`} passHref>
						<Link display="block" lineHeight="0" data-hotkey="n">
							{/* TODO: better icon */}
							<Icon as={HiOutlineAnnotation} boxSize="6" />
						</Link>
					</NextLink>
				</span>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel>
						Toggle like &middot; <Hotkey value="L" />
					</TooltipLabel>
				}
			>
				<IconButton
					icon={
						<FilledIcon
							as={HiOutlineHeart}
							boxSize="6"
							filled={bookmark.liked}
						/>
					}
					lineHeight="0"
					aria-label="Toggle liked"
					data-hotkey="l"
					onClick={onToggleLiked}
				/>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel>
						{bookmark.archived
							? "Add to reading list"
							: "Move to archive"}{" "}
						&middot; <Hotkey value="A" />
					</TooltipLabel>
				}
			>
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
					lineHeight="0"
					aria-label={
						bookmark.archived
							? "Add to reading list"
							: "Move to archive"
					}
					data-hotkey="a"
					onClick={onToggleArchived}
				/>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel>
						Edit tags &middot; <Hotkey value="T" />
					</TooltipLabel>
				}
			>
				<IconButton
					icon={<Icon as={HiOutlineTag} boxSize="6" />}
					lineHeight="0"
					aria-label="Edit tags"
					data-hotkey="t"
					onClick={() => onEditTags(bookmark)}
				/>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel>
						Delete &middot; <Hotkey value="D" />
					</TooltipLabel>
				}
			>
				<IconButton
					icon={<Icon as={HiOutlineTrash} boxSize="6" />}
					lineHeight="0"
					aria-label="Delete bookmark"
					data-hotkey="d"
					onClick={() => onDelete(bookmark)}
				/>
			</Tooltip>
		</>
	);
}
