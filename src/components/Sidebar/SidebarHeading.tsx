import { Text } from "@chakra-ui/react";

export function SidebarHeading({ children }: { children: string }) {
	return (
		<Text
			color="gray.600"
			fontWeight="light"
			px={2}
			mb={1}
			_dark={{ color: "gray.500" }}
		>
			{children}
		</Text>
	);
}
