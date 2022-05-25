import {
	BookmarksList,
	BookmarksList_bookmarkFragment,
} from "@/components/BookmarksList";
import { BookmarkSortingSettings } from "@/components/BookmarksList/BookmarksSortingSettings";
import { HeaderPortal } from "@/components/Header";
import { useZodForm } from "@/hooks/useZodForm";
import {
	SearchBookmarksQuery,
	SearchBookmarksQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import {
	Box,
	Button,
	Center,
	Grid,
	Input,
	Select,
	Spacer,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMemo, useState } from "react";
import { enum as zodEnum, object, string, TypeOf } from "zod";

const scopeEnum = zodEnum(["all", "liked", "archive"]);
const schema = object({
	query: string(),
	scope: scopeEnum,
});
type Schema = TypeOf<typeof schema>;

export default function SearchBookmarksPage() {
	const [query, setQuery] = useState<SearchBookmarksQueryVariables>({
		query: "",
		oldestFirst: false,
	});
	const form = useZodForm({ schema });

	const {
		data: currentData,
		previousData,
		loading,
		fetchMore,
	} = useQuery<SearchBookmarksQuery, SearchBookmarksQueryVariables>(
		gql`
			${BookmarksList_bookmarkFragment}

			query SearchBookmarks(
				$cursor: String
				$query: String!
				$archived: Boolean
				$liked: Boolean
				$oldestFirst: Boolean!
			) {
				bookmarks(
					filter: {
						query: $query
						archived: $archived
						liked: $liked
					}
					oldestFirst: $oldestFirst
					after: $cursor
				) {
					edges {
						node {
							id
							...BookmarksList_bookmark
						}
					}
					pageInfo {
						endCursor
						hasNextPage
					}
				}
			}
		`,
		{
			// TODO: fix refetching
			// fetchPolicy: "cache-and-network",
			variables: query,
			skip: !query.query,
			notifyOnNetworkStatusChange: true,
		}
	);

	const handleUpdateQuery = (
		values: Partial<SearchBookmarksQueryVariables>
	) => {
		setQuery(prev => ({ ...prev, ...values }));
	};

	const handleSubmit = (values: Schema) => {
		if (values.query) {
			handleUpdateQuery({
				query: values.query,
				liked: values.scope === "liked" ? true : undefined,
				archived: values.scope === "archive" ? true : undefined,
			});
		}
	};

	const data = currentData ?? previousData;
	const bookmarks = useMemo(
		() => data?.bookmarks.edges.map(b => b.node),
		[data?.bookmarks]
	);

	const handleFetchMore = () => {
		if (data) {
			fetchMore({
				variables: {
					cursor: data.bookmarks.pageInfo.endCursor,
				},
			});
		}
	};

	return (
		<>
			<HeaderPortal>
				<Box>Search Bookmarks</Box>

				<Spacer />

				<BookmarkSortingSettings
					oldestFirst={query.oldestFirst}
					onChangeOldestFirst={value =>
						handleUpdateQuery({ oldestFirst: value })
					}
				/>
			</HeaderPortal>

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
					autoFocus
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

			{bookmarks && <BookmarksList bookmarks={bookmarks} />}

			{data?.bookmarks.pageInfo.hasNextPage && (
				<Center mt="2">
					<Button isLoading={loading} onClick={handleFetchMore}>
						Load more
					</Button>
				</Center>
			)}
		</>
	);
}
