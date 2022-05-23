import {
	BookmarkActions,
	BookmarkActions_bookmarkFragment,
} from "@/components/Bookmark/BookmarkActions";
import { BookmarkActionButton } from "@/components/Bookmark/BookmarkActions/BookmarkActionButton";
import {
	BookmarkEditForm,
	BookmarkEditForm_bookmarkFragment,
} from "@/components/Bookmark/BookmarkEditForm";
import { HeaderPortal } from "@/components/Header";
import { TagsList, TagsList_tagFragment } from "@/components/TagsList";
import { Tooltip } from "@/components/Tooltip";
import { TooltipLabel } from "@/components/Tooltip/TooltipLabel";
import { useAutoHotkeys } from "@/hooks/useAutoHotkeys";
import { getHostnameFromUrl } from "@/utils";
import {
	GetBookmarkQuery,
	GetBookmarkQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import {
	Box,
	Center,
	Heading,
	HStack,
	Link,
	Spacer,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";

export default function BookmarkPage() {
	const router = useRouter();
	const id = router.query.id as string | undefined;

	const [isEditing, setIsEditing] = useState(false);
	const actionsRef = useRef<HTMLDivElement | null>(null);

	const { data } = useQuery<GetBookmarkQuery, GetBookmarkQueryVariables>(
		gql`
			${TagsList_tagFragment}
			${BookmarkEditForm_bookmarkFragment}
			${BookmarkActions_bookmarkFragment}

			query GetBookmark($id: String!) {
				bookmark(id: $id) {
					id
					title
					url
					note
					tags {
						id
						...TagsList_tag
					}
					...BookmarkEditForm_bookmark
					...BookmarkActions_bookmark
				}
			}
		`,
		{ variables: { id: id! }, skip: !id }
	);

	useAutoHotkeys({ ref: document.body, scopeRef: actionsRef });

	const bookmark = data?.bookmark;

	// TODO: render as markdown
	const renderedNote = useMemo(() => {
		if (!bookmark?.note) {
			return null;
		}

		return bookmark.note
			.split("\n")
			.filter(Boolean)
			.map((paragraph, index) => (
				<Text
					key={index}
					fontSize="lg"
					lineHeight="1.7"
					_notFirst={{ mt: "1em" }}
				>
					{paragraph}
				</Text>
			));
	}, [bookmark?.note]);

	return (
		<>
			{bookmark && !isEditing && (
				<HeaderPortal>
					<Spacer />

					<HStack ref={actionsRef}>
						<Tooltip
							label={
								<TooltipLabel text="Edit bookmark" hotkey="E" />
							}
						>
							<BookmarkActionButton
								icon={HiOutlinePencil}
								onClick={() => setIsEditing(true)}
								hotkey="e"
								aria-label="Edit bookmark"
							/>
						</Tooltip>

						<BookmarkActions
							bookmark={bookmark}
							afterDelete={() => router.replace("/read")}
						/>
					</HStack>
				</HeaderPortal>
			)}

			{!bookmark ? (
				<Center w="full" h="32">
					<Spinner />
				</Center>
			) : isEditing ? (
				<Box mt="4">
					<BookmarkEditForm
						bookmark={bookmark}
						onDone={() => setIsEditing(false)}
					/>
				</Box>
			) : (
				<Stack spacing="2" mt="6">
					<Box>
						<Heading as="h2" size="lg">
							{bookmark.title}
						</Heading>

						<Link
							href={bookmark.url}
							isExternal
							color="lightslategray"
						>
							{getHostnameFromUrl(bookmark.url)}
						</Link>
					</Box>
					{bookmark.tags && <TagsList tags={bookmark.tags} />}
					(renderedNote && <Box>{renderedNote}</Box>)
				</Stack>
			)}
		</>
	);
}
