import { BookmarkEditForm } from "@/components/Bookmark/BookmarkEditForm";
import { Header } from "@/components/Header";
import { TagsList, TagsList_tagFragment } from "@/components/TagsList";
import { getHostnameFromUrl } from "@/utils";
import {
	GetBookmarkQuery,
	GetBookmarkQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import {
	Box,
	Button,
	Center,
	Heading,
	HStack,
	Link,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function BookmarkPage() {
	const router = useRouter();
	const id = router.query.id as string | undefined;

	const [isEditing, setIsEditing] = useState(false);

	const { data } = useQuery<GetBookmarkQuery, GetBookmarkQueryVariables>(
		gql`
			${TagsList_tagFragment}

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
			<Header />

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
						<HStack alignItems="start">
							<Heading flex={1} as="h2" size="lg">
								{bookmark.title}
							</Heading>
							<Button
								size="md"
								onClick={() => setIsEditing(true)}
							>
								Edit
							</Button>
						</HStack>

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
