import {
	Avatar,
	Button,
	HStack,
	Stack,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import {
	ArchiveIcon,
	CollectionIcon,
	HeartIcon,
	PencilAltIcon,
	SearchIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { AddBookmarkModal } from "../AddBookmarkModal";
import { SidebarHeading } from "./SidebarHeading";
import { SidebarLink } from "./SidebarLink";

export function Sidebar() {
	const session = useSession<true>();

	const addBookmarkModalState = useDisclosure();

	return (
		<Stack
			w="40"
			h="max-content"
			position="sticky"
			top="0"
			zIndex="sticky"
			direction="column"
			alignItems="start"
			py={3}
			pr={3}
			gap={2}
		>
			<HStack w="full" px={2}>
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
				onClick={addBookmarkModalState.onOpen}
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
		</Stack>
	);
}
