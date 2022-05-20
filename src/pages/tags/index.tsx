import { Empty } from "@/components/Empty";
import { Header } from "@/components/Header";
import { TagsList, TagsList_tagFragment } from "@/components/TagsList";
import {
	GetAllTagsQuery,
	GetAllTagsQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import { Box, Center, Input, Spinner, Stack } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useState } from "react";

export default function AllTagsPage() {
	const [query, setQuery] = useState("");

	const { data } = useQuery<GetAllTagsQuery, GetAllTagsQueryVariables>(
		gql`
			${TagsList_tagFragment}

			query GetAllTags {
				tags {
					id
					...TagsList_tag
				}
			}
		`,
		{ fetchPolicy: "cache-and-network" }
	);

	const tags = data?.tags.filter(tag => !query || tag.name.includes(query));

	return (
		<>
			<Header>
				<Box>
					All Tags{" "}
					{data?.tags?.length !== undefined &&
						`(${data.tags.length})`}
				</Box>
			</Header>

			{!tags ? (
				<Center w="full" h="32">
					<Spinner />
				</Center>
			) : (
				<Stack direction="column" mt="3">
					<Input
						value={query}
						onChange={e => setQuery(e.target.value)}
						placeholder="Search your tags"
					/>

					{data!.tags.length === 0 ? (
						<Empty>No tags.</Empty>
					) : (
						<TagsList tags={tags} />
					)}
				</Stack>
			)}
		</>
	);
}
