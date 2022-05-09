import { chakra, ChakraProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props extends ChakraProps {
	children: ReactNode;
}

export function TooltipLabel({ children, ...props }: Props) {
	return (
		<chakra.span color="gray.800" _dark={{ color: "white" }} {...props}>
			{children}
		</chakra.span>
	);
}
