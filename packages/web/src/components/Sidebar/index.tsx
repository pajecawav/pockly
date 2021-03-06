import { useAutoHotkeys } from "@/hooks/useAutoHotkeys";
import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
import {
	Box,
	Button,
	Icon,
	IconButton,
	Stack,
	useBreakpointValue,
	useColorModeValue,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
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
import { AddBookmarkModal } from "../AddBookmarkModal";
import { HEADER_HEIGHT } from "../Header";
import { TooltipLabel } from "../Tooltip/TooltipLabel";
import { DropdownMenu } from "./DropdownMenu";
import { PinnedTags } from "./PinnedTags";
import { SidebarHeading } from "./SidebarHeading";
import { SidebarLink } from "./SidebarLink";
import { SidebarSection } from "./SidebarSection";

export function Sidebar() {
	const router = useRouter();

	const sidebarRef = useRef<HTMLDivElement>(null);

	useAutoHotkeys({
		ref: document.body,
		scopeRef: sidebarRef,
		options: { capture: true },
	});

	const isMediumOrLarger = useBreakpointValue({ base: false, md: true });
	const sidebarState = useDisclosure({ defaultIsOpen: false });
	const sidebarIsOpen = sidebarState.isOpen && !isMediumOrLarger;

	useEffect(() => {
		function handler(e: MouseEvent) {
			if (!sidebarRef.current?.contains(e.target as HTMLElement)) {
				sidebarState.onClose();
			}
		}

		document.body.addEventListener("click", handler);
		return () => document.body.removeEventListener("click", handler);
	}, [sidebarState]);

	useEffect(() => {
		if (sidebarIsOpen) {
			sidebarState.onClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.pathname]);

	const addBookmarkModalState = useDisclosure();
	const bg = useDefaultBackgroundColor();

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
				pt={{ base: "12", md: "2" }}
				bg={{ base: bg, md: "transparent" }}
				ref={sidebarRef}
			>
				<Box
					h={HEADER_HEIGHT}
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
						variant="unstyled"
						size="sm"
						icon={<Icon as={HiOutlineMenu} boxSize="6" />}
						aria-label="Toggle sidebar"
						onClick={sidebarState.onToggle}
					/>
				</Box>

				<DropdownMenu />

				<Button
					size="sm"
					variant="outline"
					fontWeight="normal"
					shadow="sm"
					border="1px"
					flexShrink={0}
					leftIcon={<HiOutlinePencilAlt width={16} />}
					data-hotkey="c"
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

				<Stack as="nav" direction="column" w="full" spacing="2">
					<SidebarSection>
						<SidebarHeading>Bookmarks</SidebarHeading>
						<SidebarLink
							href="/read"
							icon={HiOutlineCollection}
							hotkey="g r"
							label={
								<TooltipLabel
									text="Go to reading list"
									hotkey="G R"
								/>
							}
						>
							Reading List
						</SidebarLink>
						<SidebarLink
							href="/liked"
							icon={HiOutlineHeart}
							hotkey="g l"
							label={
								<TooltipLabel text="Go to liked" hotkey="G L" />
							}
						>
							Liked
						</SidebarLink>
						<SidebarLink
							href="/archive"
							icon={HiOutlineArchive}
							hotkey="g a"
							label={
								<TooltipLabel
									text="Go to archive"
									hotkey="G A"
								/>
							}
						>
							Archive
						</SidebarLink>
						<SidebarLink
							href="/search"
							icon={HiOutlineSearch}
							hotkey="g s"
							label={
								<TooltipLabel
									text="Go to search"
									hotkey="G S"
								/>
							}
						>
							Search
						</SidebarLink>
					</SidebarSection>

					<SidebarSection>
						<SidebarHeading>Tags</SidebarHeading>
						<SidebarLink
							href="/tags"
							icon={HiOutlineTag}
							hotkey="g t"
							label={
								<TooltipLabel text="Go to tags" hotkey="G T" />
							}
						>
							All Tags
						</SidebarLink>
						<PinnedTags />
					</SidebarSection>
				</Stack>
			</VStack>
		</RemoveScroll>
	);
}
