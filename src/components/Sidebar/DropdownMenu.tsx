import {
	Avatar,
	Button,
	chakra,
	Divider,
	HStack,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Text,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { ThemeSelect } from "../ThemeSelect";

export function DropdownMenu() {
	const session = useSession<true>();

	return (
		<Popover closeOnBlur={true} placement="bottom-end">
			<PopoverTrigger>
				<Button variant="link" size="sm">
					<Avatar
						size="xs"
						src={session.data?.user.image ?? undefined}
						mr="2"
					/>
					<Text noOfLines={1}>{session.data?.user?.name}</Text>
				</Button>
			</PopoverTrigger>

			<PopoverContent
				w="60"
				py="2"
				fontSize="sm"
				fontWeight="medium"
				display="flex"
				flexDirection="column"
				gap="2"
				_focus={{ boxShadow: "none" }}
			>
				<HStack px="4">
					<Text mr="2">Theme</Text> <ThemeSelect />
				</HStack>

				<Divider />

				<chakra.button
					textAlign="left"
					fontWeight="medium"
					px="4"
					py="2"
					_hover={{ bg: "gray.50" }}
					_dark={{ _hover: { bg: "gray.600" } }}
					onClick={() => signOut()}
				>
					Logout
				</chakra.button>
			</PopoverContent>
		</Popover>
	);
}
