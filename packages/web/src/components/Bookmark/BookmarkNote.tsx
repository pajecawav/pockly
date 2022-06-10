import {
	Box,
	Code,
	Heading,
	Link,
	ListItem,
	OrderedList,
	Text,
	UnorderedList,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

interface Props {
	text: string;
}

export function BookmarkNote({ text }: Props) {
	return (
		<ReactMarkdown
			components={{
				a: ({ href, children, node }) => (
					<Link color="blue.400" href={href} isExternal={true}>
						{children}
					</Link>
				),
				blockquote: ({ children, node }) => (
					<Box
						borderLeftWidth="4px"
						borderColor="gray.200"
						_dark={{ borderColor: "gray.500" }}
						pl="4"
					>
						{children}
					</Box>
				),
				code: ({ inline, children, node }) =>
					inline ? (
						<Code px="2" borderRadius="lg">
							{children}
						</Code>
					) : (
						<Code
							px="3"
							py="2"
							borderRadius="lg"
							w="full"
							overflowX="auto"
						>
							{children}
						</Code>
					),
				h1: ({ children, node }) => (
					<Heading as="h1">{children}</Heading>
				),
				h2: ({ children, node }) => (
					<Heading as="h2" size="lg">
						{children}
					</Heading>
				),
				h3: ({ children, node }) => (
					<Heading as="h3" size="md">
						{children}
					</Heading>
				),
				h4: ({ children, node }) => (
					<Heading as="h4" size="md">
						{children}
					</Heading>
				),
				h5: ({ children, node }) => (
					<Heading as="h5" size="md">
						{children}
					</Heading>
				),
				h6: ({ children, node }) => (
					<Heading as="h6" size="md">
						{children}
					</Heading>
				),
				ol: OrderedList,
				ul: UnorderedList,
				li: ({ children, node }) => (
					<ListItem listStylePos="inside">{children}</ListItem>
				),
				p: Text,
			}}
		>
			{text}
		</ReactMarkdown>
	);
}
