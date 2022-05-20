import {
	BookmarksListEntry_BookmarkFragment,
	DeleteBookmarkMutation,
	DeleteBookmarkMutationVariables,
	UpdateBookmarkMutation,
	UpdateBookmarkMutationVariables,
	UpdateBookmarkMutation_BookmarkFragment,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { Icon, IconButton, Link, useToast } from "@chakra-ui/react";
import gql from "graphql-tag";
import NextLink from "next/link";
import { useState } from "react";
import {
	HiOutlineAnnotation,
	HiOutlineArchive,
	HiOutlineHeart,
	HiOutlinePlus,
	HiOutlineTag,
	HiOutlineTrash,
} from "react-icons/hi";
import { DeleteBookmarkConfirmationModal } from "./DeleteBookmarkConfirmationModal";
import { EditBookmarkTagsModal } from "./EditBookmarkTagsModal";
import { FilledIcon } from "./FilledIcon";
import { Hotkey } from "./Hotkey";
import { Tooltip } from "./Tooltip";
import { TooltipLabel } from "./Tooltip/TooltipLabel";

interface Props {
	bookmark: BookmarksListEntry_BookmarkFragment;
	afterDelete?: () => void;
}

const UpdateBookmarkMutation_bookmarkFragment = gql`
	fragment UpdateBookmarkMutation_bookmark on Bookmark {
		liked
		archived
	}
`;

export function BookmarksListEntryActions({ bookmark, afterDelete }: Props) {
	const toast = useToast();

	const [currentAction, setCurrentAction] = useState<
		"editTags" | "delete" | null
	>(null);

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

	// probably should move this to the `DeleteBookmarkConfirmationModal`
	const [mutateDelete, { loading: isDeleting }] = useMutation<
		DeleteBookmarkMutation,
		DeleteBookmarkMutationVariables
	>(
		gql`
			mutation DeleteBookmark($id: String!) {
				deleteBookmark(id: $id) {
					id
				}
			}
		`,
		{
			optimisticResponse: vars => ({ deleteBookmark: { id: vars.id } }),
			onCompleted: () => {
				toast({
					status: "success",
					description: "Deleted bookmark!",
				});
				afterDelete?.();
			},
			update: (cache, result) => {
				if (result.data?.deleteBookmark) {
					cache.evict({
						id: cache.identify(result.data.deleteBookmark),
					});
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

	const onDelete = () => {
		mutateDelete({
			variables: { id: bookmark.id },
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
					onClick={() => setCurrentAction("editTags")}
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
					onClick={() => setCurrentAction("delete")}
				/>
			</Tooltip>

			<EditBookmarkTagsModal
				bookmark={currentAction === "editTags" ? bookmark : null}
				onClose={() => setCurrentAction(null)}
			/>

			<DeleteBookmarkConfirmationModal
				isOpen={currentAction === "delete"}
				isDeleting={isDeleting}
				onConfirm={onDelete}
				onClose={() => setCurrentAction(null)}
			/>
		</>
	);
}
