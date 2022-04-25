import { BookmarksList } from "@/components/BookmarksList";
import { Header } from "@/components/Header";
import { useZodForm } from "@/hooks/useZodForm";
import {
	SearchBookmarksQuery,
	SearchBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Button, HStack, Input, Select } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useState } from "react";
import { enum as zodEnum, object, string, TypeOf } from "zod";

const scopeEnum = zodEnum(["all", "liked", "archive"]);
const schema = object({
	query: string(),
	scope: scopeEnum,
});
type Schema = TypeOf<typeof schema>;

export default function SearchBookmarksPage() {
	const [query, setQuery] = useState<SearchBookmarksQueryVariables | null>(
		null
	);
	const form = useZodForm({ schema });

	const { data, previousData, loading } = useQuery<
		SearchBookmarksQuery,
		SearchBookmarksQueryVariables
	>(
		gql`
			${BookmarksList.fragments.bookmark}

			query SearchBookmarks(
				$query: String!
				$archived: Boolean
				$liked: Boolean
			) {
				bookmarks(
					filter: {
						title: $query
						archived: $archived
						liked: $liked
					}
					sort: createdAt
				) {
					id
					...BookmarksListEntry_bookmark
				}
			}
		`,
		{ variables: query!, skip: !query }
	);

	const handleSubmit = (values: Schema) => {
		if (values.query) {
			setQuery({
				query: values.query,
				liked: values.scope === "liked" ? true : undefined,
				archived: values.scope === "archive" ? true : undefined,
			});
		}
	};

	const currentData = data ?? previousData;

	return (
		<>
			<Header>
				<Box>
					Search Bookmarks{" "}
					{currentData?.bookmarks?.length !== undefined &&
						`(${currentData.bookmarks.length})`}
				</Box>
			</Header>

			{/* TODO: responsive layout */}
			<HStack
				as="form"
				my="2"
				alignItems="stretch"
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<Input
					type="search"
					placeholder="Search"
					{...form.register("query")}
				/>
				<Select
					w="60"
					defaultValue={scopeEnum.enum.all}
					{...form.register("scope")}
				>
					<option value={scopeEnum.enum.all}>All Boomarks</option>
					<option value={scopeEnum.enum.liked}>Liked</option>
					<option value={scopeEnum.enum.archive}>Archive</option>
				</Select>
				<Button
					type="submit"
					isLoading={loading}
					size="md"
					flexShrink={0}
				>
					Search
				</Button>
			</HStack>

			{currentData && <BookmarksList bookmarks={currentData.bookmarks} />}
		</>
	);
}
