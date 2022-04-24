import { BookmarksListEntry_BookmarkFragment } from "@/__generated__/operations";
import { Stack } from "@chakra-ui/react";
import { BookmarksListEntry } from "./BookmarksListEntry";

interface Props {
	bookmarks: BookmarksListEntry_BookmarkFragment[];
}

export function BookmarksList({ bookmarks }: Props) {
	return (
		<Stack direction="column" spacing="0">
			{bookmarks.map(bookmark => (
				<BookmarksListEntry bookmark={bookmark} key={bookmark.id} />
			))}
		</Stack>
	);
}

BookmarksList.fragments = {
	bookmark: BookmarksListEntry.fragments.bookmark,
};
