import {
	BookmarkActions,
	BookmarkActions_bookmarkFragment,
} from "@/components/Bookmark/BookmarkActions";
import { BookmarkActionButton } from "@/components/Bookmark/BookmarkActions/BookmarkActionButton";
import {
	BookmarkEditForm,
	BookmarkEditForm_bookmarkFragment,
} from "@/components/Bookmark/BookmarkEditForm";
import { BookmarkNote } from "@/components/Bookmark/BookmarkNote";
import { HeaderPortal } from "@/components/Header";
import { TagsList, TagsList_tagFragment } from "@/components/TagsList";
import { Tooltip } from "@/components/Tooltip";
import { TooltipLabel } from "@/components/Tooltip/TooltipLabel";
import { useAutoHotkeys } from "@/hooks/useAutoHotkeys";
import { useCanGoBack } from "@/hooks/useCanGoBack";
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
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { HiOutlineArrowLeft, HiOutlinePencil } from "react-icons/hi";

export default function BookmarkPage() {
	const router = useRouter();
	const id = router.query.id as string | undefined;

	const [isEditing, setIsEditing] = useState(false);

	const actionsRef = useRef<HTMLDivElement | null>(null);
	useAutoHotkeys({ ref: document.body, scopeRef: actionsRef });

	const canGoBack = useCanGoBack();

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
					addedAt
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

	const bookmark = data?.bookmark;

	if (!bookmark) {
		return (
			<Center w="full" h="32">
				<Spinner />
			</Center>
		);
	}

	return (
		<>
			{!isEditing && (
				<HeaderPortal ref={actionsRef}>
					{canGoBack && (
						<Tooltip
							label={<TooltipLabel text="Go back" hotkey="Esc" />}
						>
							<BookmarkActionButton
								icon={HiOutlineArrowLeft}
								onClick={() => router.back()}
								hotkey="Escape"
								aria-label="Go back"
							/>
						</Tooltip>
					)}

					<Spacer />

					{bookmark && (
						<HStack>
							<Tooltip
								label={
									<TooltipLabel
										text="Edit bookmark"
										hotkey="E"
									/>
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
					)}
				</HeaderPortal>
			)}

			{isEditing ? (
				<Box mt="4">
					<BookmarkEditForm
						bookmark={bookmark}
						onDone={() => setIsEditing(false)}
					/>
				</Box>
			) : (
				<Stack spacing="2" mt="6">
					<Box>
						<Heading as="div" size="lg">
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

					{bookmark.note && <BookmarkNote text={bookmark.note} />}
				</Stack>
			)}
		</>
	);
}
