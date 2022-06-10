import { BookmarkActions_BookmarkFragment } from "@/__generated__/operations";
import gql from "graphql-tag";
import { useState } from "react";
import { HiOutlineShare, HiOutlineTag, HiOutlineTrash } from "react-icons/hi";
import { DeleteBookmarkConfirmationModal } from "../../DeleteBookmarkModal";
import {
	EditBookmarkTagsModal,
	EditBookmarkTagsModal_bookmarkFragment,
} from "../../EditBookmarkTagsModal";
import { Tooltip } from "../../Tooltip";
import { TooltipLabel } from "../../Tooltip/TooltipLabel";
import { BookmarkActionButton } from "./BookmarkActionButton";
import { ToggleArchivedBookmarkButton } from "./ToggleArchivedBookmarkButton";
import { ToggleLikedBookmarkButton } from "./ToggleLikedBookmarkButton";

interface Props {
	bookmark: BookmarkActions_BookmarkFragment;
	afterDelete?: () => void;
}

export const BookmarkActions_bookmarkFragment = gql`
	${EditBookmarkTagsModal_bookmarkFragment}

	fragment BookmarkActions_bookmark on Bookmark {
		id
		url
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
	const [currentAction, setCurrentAction] = useState<
		"editTags" | "delete" | null
	>(null);

	return (
		<>
			<Tooltip label={<TooltipLabel text="Toggle like" hotkey="L" />}>
				<ToggleLikedBookmarkButton
					id={bookmark.id}
					liked={bookmark.liked}
					data-hotkey="l"
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
				<ToggleArchivedBookmarkButton
					id={bookmark.id}
					archived={bookmark.archived}
					data-hotkey="a"
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

			{"share" in navigator && (
				<BookmarkActionButton
					icon={HiOutlineShare}
					aria-label="Share bookmark"
					onClick={() => navigator.share({ url: bookmark.url })}
				/>
			)}

			<BookmarkActionButton
				icon={HiOutlineTrash}
				aria-label="Delete bookmark"
				data-hotkey="d"
				onClick={() => setCurrentAction("delete")}
			/>

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
