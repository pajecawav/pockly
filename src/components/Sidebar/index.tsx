import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
import { usePinnedTagsStore } from "@/stores/usePinnedTagsStore";
import {
	Avatar,
	Box,
	Button,
	HStack,
	Icon,
	IconButton,
	Stack,
	Text,
	useBreakpointValue,
	useColorModeValue,
	useDisclosure,
	useOutsideClick,
	VStack,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import {
	HiOutlineArchive,
	HiOutlineCollection,
	HiOutlineHeart,
	HiOutlineMenu,
	HiOutlinePencilAlt,
	HiOutlineSearch,
	HiOutlineTag,
} from "react-icons/hi";
import { RemoveScroll } from "react-remove-scroll";
import { AddBookmarkModal } from "./AddBookmarkModal";
import { SidebarHeading } from "./SidebarHeading";
import { SidebarLink } from "./SidebarLink";

export function Sidebar() {
	const session = useSession<true>();
	const router = useRouter();

	const pinnedTags = usePinnedTagsStore(store => store.tags);

	const isMediumOrLarger = useBreakpointValue({ base: false, md: true });
	const sidebarRef = useRef<HTMLDivElement>(null);
	const sidebarState = useDisclosure({ defaultIsOpen: false });
	const sidebarIsOpen = sidebarState.isOpen && !isMediumOrLarger;

	useOutsideClick({
		ref: sidebarRef,
		handler: event => {
			event.preventDefault();
			sidebarState.onClose();
		},
		enabled: sidebarIsOpen,
	});

	useEffect(() => {
		if (sidebarIsOpen) {
			sidebarState.onClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.pathname]);

	const addBookmarkModalState = useDisclosure();

	return (
		<RemoveScroll enabled={sidebarIsOpen}>
			{/* overlay to prevent mouse events outside of sidebar */}
			<Box
				display={{ base: sidebarIsOpen ? "block" : "none", md: "none" }}
				position="fixed"
				inset="0"
				bg="transparent"
				zIndex="overlay"
			/>

			<VStack
				as="nav"
				w="48"
				h={{ base: "100vh", md: "max-content" }}
				zIndex="overlay"
				position={{ base: "fixed", md: "sticky" }}
				top="0"
				left={{
					base: sidebarState.isOpen ? "0" : "-48",
					md: undefined,
				}}
				transition="left 0.25s ease-out"
				boxShadow={{
					base: useColorModeValue(
						"rgba(0, 0, 0, 0.07) 0px 0px 16px",
						"rgba(0, 0, 0, 0.25) 0px 0px 16px"
					),
					md: "none",
				}}
				alignItems="start"
				gap={2}
				pr={5}
				pl={{ base: "3", md: "0" }}
				pt={{ base: "10", md: "2" }}
				bg={useDefaultBackgroundColor()}
				ref={sidebarRef}
			>
				<Box
					h="14"
					display={{ base: "grid", md: "none" }}
					placeItems="center"
					position="fixed"
					top="0"
					left="3"
					zIndex="popover"
				>
					<IconButton
						display="grid"
						placeItems="center"
						size="sm"
						icon={<Icon as={HiOutlineMenu} boxSize="6" />}
						aria-label="Toggle sidebar"
						onClick={sidebarState.onToggle}
					/>
				</Box>

				<HStack w="full">
					<Button
						variant="link"
						display="flex"
						gap={2}
						alignItems="center"
						onClick={() => signOut()}
					>
						<Avatar
							size="xs"
							src={session.data?.user.image ?? undefined}
						/>
						<Text isTruncated>{session.data?.user?.name}</Text>
					</Button>
				</HStack>

				<Button
					size="sm"
					variant="outline"
					fontWeight="normal"
					shadow="sm"
					border="1px"
					leftIcon={<HiOutlinePencilAlt width={16} />}
					onClick={() => {
						sidebarState.onClose();
						addBookmarkModalState.onOpen();
					}}
				>
					Add bookmark
				</Button>
				<AddBookmarkModal
					isOpen={addBookmarkModalState.isOpen}
					onClose={addBookmarkModalState.onClose}
				/>

				<Stack direction="column" w="full" spacing="0.5">
					<SidebarHeading>Bookmarks</SidebarHeading>
					<SidebarLink href="/read" icon={HiOutlineCollection}>
						Reading List
					</SidebarLink>
					<SidebarLink href="/liked" icon={HiOutlineHeart}>
						Liked
					</SidebarLink>
					<SidebarLink href="/archive" icon={HiOutlineArchive}>
						Archive
					</SidebarLink>
					<SidebarLink href="/search" icon={HiOutlineSearch}>
						Search
					</SidebarLink>

					<SidebarHeading mt="10">Tags</SidebarHeading>
					<SidebarLink href="/tags" icon={HiOutlineTag}>
						All Tags
					</SidebarLink>
					{pinnedTags.map(tag => (
						<SidebarLink href={`/tags/${tag}`} key={tag}>
							{tag}
						</SidebarLink>
					))}
				</Stack>
			</VStack>
		</RemoveScroll>
	);
}
