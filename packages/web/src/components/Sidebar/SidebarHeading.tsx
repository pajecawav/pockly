import { Text, TextProps } from "@chakra-ui/react";

interface Props extends TextProps {
	children: string;
}

export function SidebarHeading({ children, ...props }: Props) {
	return (
		<Text
			color="gray.600"
			fontWeight="light"
			px={2}
			_dark={{ color: "gray.500" }}
			{...props}
		>
			{children}
		</Text>
	);
}
