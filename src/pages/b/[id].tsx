import { EditableBookmarkNote } from "@/components/EditableBookmarkNote";
import { Header } from "@/components/Header";
import { TagsList, TagsList_tagFragment } from "@/components/TagsList";
import { getHostnameFromUrl } from "@/utils";
import {
	GetBookmarkQuery,
	GetBookmarkQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Link, Spinner, Stack, Text } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";

export default function BookmarkPage() {
	const router = useRouter();
	const id = router.query.id as string | undefined;

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

	return (
		<>
			<Header>
				{bookmark && (
					<Text noOfLines={1} title={bookmark?.title}>
						{bookmark.title}
					</Text>
				)}
			</Header>

			{!bookmark ? (
				<Center w="full" h="32">
					<Spinner />
				</Center>
			) : (
				<Stack spacing="2" mt="4">
					<Box>
						<Box fontSize="2xl" fontWeight="medium">
							{bookmark.title}
						</Box>
						<Link
							href={bookmark.url}
							isExternal
							color="lightslategray"
						>
							{getHostnameFromUrl(bookmark.url)}
						</Link>
					</Box>

					{bookmark.tags && <TagsList tags={bookmark.tags} />}

					<EditableBookmarkNote
						id={bookmark.id}
						note={bookmark.note}
					/>
				</Stack>
			)}
		</>
	);
}
