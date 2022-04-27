import { BookmarksList } from "@/components/BookmarksList";
import { Header } from "@/components/Header";
import {
	GetBookmarksWithTagQuery,
	GetBookmarksWithTagQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Spinner } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";

export default function BookmarksWithTagPage() {
	const router = useRouter();
	const tag = router.query.tag as string;

	const { data } = useQuery<
		GetBookmarksWithTagQuery,
		GetBookmarksWithTagQueryVariables
	>(
		gql`
			${BookmarksList.fragments.bookmark}

			query GetBookmarksWithTag($tag: String!) {
				bookmarks(tag: $tag) {
					id
					...BookmarksListEntry_bookmark
				}
			}
		`,
		{ variables: { tag }, skip: !tag }
	);

	return (
		<>
			<Header>
				<Box>
					Tagged: {tag}{" "}
					{data?.bookmarks?.length !== undefined &&
						`(${data.bookmarks.length})`}
				</Box>
			</Header>
			{!data ? (
				<Center w="full" h="32">
					<Spinner />
				</Center>
			) : (
				<BookmarksList bookmarks={data.bookmarks} />
			)}
		</>
	);
}
