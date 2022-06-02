import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
import { Tooltip as ChakraTooltip, TooltipProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props extends TooltipProps {
	children: ReactNode;
}

export function Tooltip({ children, ...props }: Props) {
	return (
		<ChakraTooltip
			bg={useDefaultBackgroundColor()}
			fontSize="xs"
			borderWidth="1px"
			borderRadius="md"
			boxShadow="sm"
			py="3px"
			{...props}
		>
			{children}
		</ChakraTooltip>
	);
}
