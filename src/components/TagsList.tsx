import { TagsList_TagFragment } from "@/__generated__/operations";
import { Flex, FlexProps, Link, Tag, TagProps } from "@chakra-ui/react";
import gql from "graphql-tag";
import NextLink from "next/link";

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
				<NextLink key={tag.id} href={`/tags/${tag.name}`} passHref>
					<Link>
						<Tag size={size}>{tag.name}</Tag>
					</Link>
				</NextLink>
			))}
		</Flex>
	);
}
