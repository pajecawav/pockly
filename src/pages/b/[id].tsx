import {
	BookmarkEditForm,
	BookmarkEditForm_bookmarkFragment,
} from "@/components/Bookmark/BookmarkEditForm";
import { HeaderPortal } from "@/components/Header";
import { TagsList, TagsList_tagFragment } from "@/components/TagsList";
import { Tooltip } from "@/components/Tooltip";
import { TooltipLabel } from "@/components/Tooltip/TooltipLabel";
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
	Icon,
	IconButton,
	Link,
	Spacer,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";

export default function BookmarkPage() {
	const router = useRouter();
	const id = router.query.id as string | undefined;

	const [isEditing, setIsEditing] = useState(false);

	const { data } = useQuery<GetBookmarkQuery, GetBookmarkQueryVariables>(
		gql`
			${TagsList_tagFragment}
			${BookmarkEditForm_bookmarkFragment}

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
				}
			}
		`,
		{ variables: { id: id! }, skip: !id }
	);

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
			{!isEditing && (
				<HeaderPortal>
					<Spacer />

					<Tooltip label={<TooltipLabel>Edit bookmark</TooltipLabel>}>
						<IconButton
							icon={<Icon as={HiOutlinePencil} boxSize="5" />}
							variant="ghost"
							size="sm"
							onClick={() => setIsEditing(true)}
							aria-label="Edit bookmark"
						/>
					</Tooltip>
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
