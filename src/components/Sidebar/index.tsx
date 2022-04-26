import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
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
import {
	ArchiveIcon,
	CollectionIcon,
	HeartIcon,
	MenuIcon,
	PencilAltIcon,
	SearchIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { AddBookmarkModal } from "../AddBookmarkModal";
import { SidebarHeading } from "./SidebarHeading";
import { SidebarLink } from "./SidebarLink";

export function Sidebar() {
	const session = useSession<true>();
	const router = useRouter();

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
		<VStack
			as="nav"
			w="52"
			h={{ base: "100vh", md: "max-content" }}
			zIndex="overlay"
			position={{ base: "fixed", md: "sticky" }}
			top="0"
			left={{ base: sidebarState.isOpen ? "0" : "-52", md: undefined }}
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
				h="12"
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
					icon={<Icon as={MenuIcon} boxSize="5" />}
					size="xs"
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
				size="xs"
				variant="outline"
				fontWeight="normal"
				shadow="sm"
				border="1px"
				leftIcon={<PencilAltIcon width={16} />}
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
				<SidebarLink href="/read" icon={CollectionIcon}>
					Reading List
				</SidebarLink>
				<SidebarLink href="/liked" icon={HeartIcon}>
					Liked
				</SidebarLink>
				<SidebarLink href="/archive" icon={ArchiveIcon}>
					Archive
				</SidebarLink>
				<SidebarLink href="/search" icon={SearchIcon}>
					Search
				</SidebarLink>
			</Stack>
		</VStack>
	);
}
