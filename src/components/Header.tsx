import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
import { Box, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
	children?: ReactNode;
}

export function Header({ children }: Props) {
	return (
		<Box
			position="sticky"
			top="0"
			zIndex="sticky"
			bg={useDefaultBackgroundColor()}
			mx="-2"
		>
			<HStack
				h="14"
				pl={{ base: "10", md: "0" }}
				py="3"
				mx="2"
				borderBottom="1px"
				borderColor="gray.100"
				_dark={{ borderColor: "gray.700" }}
				fontWeight="semibold"
			>
				{children}
			</HStack>
		</Box>
	);
}
