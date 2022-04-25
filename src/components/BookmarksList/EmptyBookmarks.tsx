import { Center } from "@chakra-ui/react";

export function EmptyBookmarks() {
	return (
		<Center
			h="40"
			fontSize="xl"
			color="lightslategray"
			borderBottom="1px"
			borderColor="gray.100"
			_dark={{ borderColor: "gray.700", bg: "gray.800" }}
		>
			No bookmarks.
		</Center>
	);
}
