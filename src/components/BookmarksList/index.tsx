import { BookmarksListEntry_BookmarkFragment } from "@/__generated__/operations";
import { Stack } from "@chakra-ui/react";
import { BookmarksListEntry } from "./BookmarksListEntry";
import { EmptyBookmarks } from "./EmptyBookmarks";

interface Props {
	bookmarks: BookmarksListEntry_BookmarkFragment[];
}

export function BookmarksList({ bookmarks }: Props) {
	return (
		<Stack direction="column" spacing="0">
			{bookmarks.length ? (
				bookmarks.map(bookmark => (
					<BookmarksListEntry bookmark={bookmark} key={bookmark.id} />
				))
			) : (
				<EmptyBookmarks />
			)}
		</Stack>
	);
}

BookmarksList.fragments = {
	bookmark: BookmarksListEntry.fragments.bookmark,
};
