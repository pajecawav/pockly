import { BookmarksList_BookmarkFragment } from "@/__generated__/operations";
import { Stack } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRef } from "react";
import {
	BookmarksListEntry,
	BookmarksListEntry_bookmarkFragment,
} from "./BookmarksListEntry";
import { EmptyBookmarks } from "./EmptyBookmarks";
import { useListFocusHotkeys } from "./useListFocusHotkeys";

interface Props {
	bookmarks: BookmarksList_BookmarkFragment[];
}

export const BookmarksList_bookmarkFragment = gql`
	${BookmarksListEntry_bookmarkFragment}

	fragment BookmarksList_bookmark on Bookmark {
		...BookmarksListEntry_bookmark
	}
`;

export function BookmarksList({ bookmarks }: Props) {
	const ref = useRef<HTMLDivElement | null>(null);
	useListFocusHotkeys({ ref });

	return (
		<Stack direction="column" spacing="0" mt="2" ref={ref}>
			{bookmarks.length === 0 ? (
				<EmptyBookmarks />
			) : (
				bookmarks.map(bookmark => (
					<BookmarksListEntry key={bookmark.id} bookmark={bookmark} />
				))
			)}
		</Stack>
	);
}
