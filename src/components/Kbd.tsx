import { chakra, ChakraProps } from "@chakra-ui/react";

interface Props extends ChakraProps {
	children: string;
}

export function Kbd({ children, ...props }: Props) {
	return (
		<chakra.span
			bg="gray.200"
			fontSize="0.9em"
			borderRadius="md"
			fontWeight="bold"
			px="0.5em"
			py="0.1em"
			lineHeight="normal"
			whiteSpace="nowrap"
			_dark={{ bg: "gray.700" }}
			{...props}
		>
			{children}
		</chakra.span>
	);
}
