import { BookmarkActions } from "@/components/Bookmark/BookmarkActions";
import { ChakraNextLink } from "@/components/ChakraNextLink";
import { TagsList } from "@/components/TagsList";
import { Tooltip } from "@/components/Tooltip";
import { TooltipLabel } from "@/components/Tooltip/TooltipLabel";
import { useAutoHotkeys } from "@/hooks/useAutoHotkeys";
import { getHostnameFromUrl } from "@/utils";
import { BookmarksListEntry_BookmarkFragment } from "@/__generated__/operations";
import { Box, Flex, HStack, Icon, Link, Stack } from "@chakra-ui/react";
import gql from "graphql-tag";
import { memo, useRef } from "react";
import { HiOutlineAnnotation } from "react-icons/hi";
import { BookmarkImage } from "./BookmarkImage";

interface Props {
	bookmark: BookmarksListEntry_BookmarkFragment;
	afterDelete?: () => void;
}

export const BookmarksListEntry_bookmarkFragment = gql`
	fragment BookmarksListEntry_bookmark on Bookmark {
		id
		title
		liked
		archived
		url
		addedAt
		image
		tags {
			id
			name
		}
	}
`;

export const BookmarksListEntry = memo(function BookmarksListEntry({
	bookmark,
	afterDelete,
}: Props) {
	const ref = useRef<HTMLDivElement | null>(null);

	useAutoHotkeys({ ref });

	return (
		<Flex
			as="article"
			direction={{ base: "column", sm: "row" }}
			alignItems={{ sm: "start" }}
			flexWrap="wrap"
			position="relative"
			py="2"
			columnGap="4"
			rowGap="1"
			borderBottom="1px"
			borderColor="gray.100"
			_dark={{ borderColor: "gray.700" }}
			data-group=""
			data-focus-list-item
			ref={ref}
		>
			<Box
				zIndex="-1"
				position="absolute"
				inset="0"
				width="full"
				boxSizing="content-box"
				px="2"
				transform="translateX(-0.5rem)"
				borderRadius="lg"
				bg="gray.100"
				display="none"
				_groupFocusWithin={{ display: { md: "block" } }}
				_dark={{ bg: "gray.700" }}
			/>

			<Stack
				direction={{ base: "row-reverse", sm: "row" }}
				w="full"
				flex={1}
				alignItems="center"
				spacing="4"
			>
				<Link href={bookmark.url} isExternal tabIndex={-1}>
					<BookmarkImage
						title={bookmark.title}
						src={bookmark.image}
					/>
				</Link>

				<Box flex="1" w="0">
					<Link
						href={bookmark.url}
						isExternal
						display="block"
						maxW="max-content"
						wordBreak="break-word"
						noOfLines={1}
						title={bookmark.title}
						data-focus-list-target
						data-hotkey="o"
					>
						{bookmark.title}
					</Link>
					<Link
						href={bookmark.url}
						isExternal
						display="block"
						maxW="max-content"
						color="lightslategray"
						wordBreak="break-word"
						noOfLines={1}
						tabIndex={-1}
					>
						{getHostnameFromUrl(bookmark.url)}
					</Link>
				</Box>
			</Stack>

			<HStack
				direction="row"
				spacing="0.5"
				mt="1"
				alignItems="center"
				order={{ base: 3, sm: "initial" }}
			>
				<Tooltip label={<TooltipLabel text="Open notes" hotkey="N" />}>
					<ChakraNextLink
						href={`/b/${bookmark.id}`}
						variant="ghost"
						size="sm"
						px="1"
						display="flex"
						data-hotkey="n"
					>
						<Icon as={HiOutlineAnnotation} boxSize="6" />
					</ChakraNextLink>
				</Tooltip>

				<BookmarkActions
					bookmark={bookmark}
					afterDelete={afterDelete}
				/>
			</HStack>

			{bookmark.tags.length !== 0 && (
				<Box w="full">
					<TagsList tags={bookmark.tags} />
				</Box>
			)}
		</Flex>
	);
});
