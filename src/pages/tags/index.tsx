import { Header } from "@/components/Header";
import {
	GetAllTagsQuery,
	GetAllTagsQueryVariables,
} from "@/__generated__/operations";
import { useQuery } from "@apollo/client";
import {
	Box,
	Center,
	Flex,
	Input,
	Link,
	Spinner,
	Stack,
	Tag,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import NextLink from "next/link";
import { useState } from "react";

export default function AllTagsPage() {
	const [query, setQuery] = useState("");

	const { data } = useQuery<GetAllTagsQuery, GetAllTagsQueryVariables>(
		gql`
			query GetAllTags {
				tags {
					id
					name
				}
			}
		`
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

					<Flex flexWrap="wrap" gap="1.5">
						{tags.map(tag => (
							<NextLink
								key={tag.id}
								href={`/tags/${tag.name}`}
								passHref
							>
								<Link>
									<Tag>{tag.name}</Tag>
								</Link>
							</NextLink>
						))}
					</Flex>
				</Stack>
			)}
		</>
	);
}
