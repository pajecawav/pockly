import { ChakraNextLink } from "@/components/ChakraNextLink";
import {
	BookmarkActions_BookmarkFragment,
	UpdateBookmarkMutation,
	UpdateBookmarkMutationVariables,
	UpdateBookmarkMutation_BookmarkFragment,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { Icon, useToast } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useState } from "react";
import {
	HiOutlineAnnotation,
	HiOutlineArchive,
	HiOutlineHeart,
	HiOutlinePlus,
	HiOutlineTag,
	HiOutlineTrash,
} from "react-icons/hi";
import { DeleteBookmarkConfirmationModal } from "../../DeleteBookmarkModal";
import {
	EditBookmarkTagsModal,
	EditBookmarkTagsModal_bookmarkFragment,
} from "../../EditBookmarkTagsModal";
import { Tooltip } from "../../Tooltip";
import { TooltipLabel } from "../../Tooltip/TooltipLabel";
import { BookmarkActionButton } from "./BookmarkActionButton";

interface Props {
	bookmark: BookmarkActions_BookmarkFragment;
	afterDelete?: () => void;
}

export const BookmarkActions_bookmarkFragment = gql`
	${EditBookmarkTagsModal_bookmarkFragment}

	fragment BookmarkActions_bookmark on Bookmark {
		id
		liked
		archived
		...EditBookmarkTagsModal_bookmark
	}
`;

const UpdateBookmarkMutation_bookmarkFragment = gql`
	fragment UpdateBookmarkMutation_bookmark on Bookmark {
		liked
		archived
	}
`;

export function BookmarkActions({ bookmark, afterDelete }: Props) {
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

	const handleToggleLiked = () => {
		mutateUpdate({
			variables: {
				id: bookmark.id,
				input: {
					liked: !bookmark.liked,
				},
			},
		});
	};

	const handleToggleArchived = () => {
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
			<Tooltip label={<TooltipLabel text="Open notes" hotkey="N" />}>
				<ChakraNextLink
					href={`/b/${bookmark.id}`}
					variant="ghost"
					size="sm"
					px="1"
					display="flex"
					data-hotkey="n"
				>
					<Icon as={HiOutlineAnnotation} boxSize="6" />
				</ChakraNextLink>
			</Tooltip>

			<Tooltip label={<TooltipLabel text="Toggle like" hotkey="L" />}>
				<BookmarkActionButton
					icon={HiOutlineHeart}
					filled={bookmark.liked}
					aria-label="Toggle liked"
					data-hotkey="l"
					onClick={handleToggleLiked}
				/>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel
						text={
							bookmark.archived
								? "Add to reading list"
								: "Move to archive"
						}
						hotkey="A"
					/>
				}
			>
				<BookmarkActionButton
					icon={bookmark.archived ? HiOutlinePlus : HiOutlineArchive}
					aria-label={
						bookmark.archived
							? "Add to reading list"
							: "Move to archive"
					}
					data-hotkey="a"
					onClick={handleToggleArchived}
				/>
			</Tooltip>

			<Tooltip label={<TooltipLabel text="Edit tags" hotkey="T" />}>
				<BookmarkActionButton
					icon={HiOutlineTag}
					aria-label="Edit tags"
					data-hotkey="t"
					onClick={() => setCurrentAction("editTags")}
				/>
			</Tooltip>

			<Tooltip label={<TooltipLabel text="Delete" hotkey="D" />}>
				<BookmarkActionButton
					icon={HiOutlineTrash}
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
				bookmarkId={currentAction === "delete" ? bookmark.id : null}
				onClose={() => setCurrentAction(null)}
				afterDelete={afterDelete}
			/>
		</>
	);
}