import { TagsList_TagFragment } from "@/__generated__/operations";
import { Flex, FlexProps, Tag, TagProps } from "@chakra-ui/react";
import gql from "graphql-tag";
import { ChakraNextLink } from "./ChakraNextLink";

interface Props extends FlexProps {
	tags: TagsList_TagFragment[];
	size?: TagProps["size"];
}

export const TagsList_tagFragment = gql`
	fragment TagsList_tag on Tag {
		id
		name
	}
`;

export function TagsList({ tags, size, ...props }: Props) {
	return (
		<Flex flexWrap="wrap" gap="1.5" {...props}>
			{tags.map(tag => (
				<ChakraNextLink key={tag.id} href={`/tags/${tag.name}`}>
					<Tag size={size} _light={{ bg: "telegram.50" }}>
						{tag.name}
					</Tag>
				</ChakraNextLink>
			))}
		</Flex>
	);
}
