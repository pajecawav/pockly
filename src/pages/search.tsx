import { BookmarksList } from "@/components/BookmarksList";
import { Header } from "@/components/Header";
import { useZodForm } from "@/hooks/useZodForm";
import {
	SearchBookmarksQuery,
	SearchBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Button, Grid, Input, Select } from "@chakra-ui/react";
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

			<Grid
				as="form"
				onSubmit={form.handleSubmit(handleSubmit)}
				mt="3"
				mb={{ base: "0", sm: "2" }}
				gridTemplateColumns={{
					base: "auto max-content",
					sm: "auto max-content max-content",
				}}
				gap="2"
			>
				<Input
					{...form.register("query")}
					type="search"
					placeholder="Search"
				/>
				<Select
					{...form.register("scope")}
					defaultValue={scopeEnum.enum.all}
					w="40"
					order={{ base: 4, sm: "unset" }}
				>
					<option value={scopeEnum.enum.all}>All Boomarks</option>
					<option value={scopeEnum.enum.liked}>Liked</option>
					<option value={scopeEnum.enum.archive}>Archive</option>
				</Select>
				<Button type="submit" size="md" isLoading={loading}>
					Search
				</Button>
			</Grid>

			{currentData && <BookmarksList bookmarks={currentData.bookmarks} />}
		</>
	);
}
