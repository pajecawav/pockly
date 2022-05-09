import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
import {
	Box,
	HStack,
	Icon,
	IconButton,
	Spacer,
	useColorMode,
} from "@chakra-ui/react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export function Header({ children }: Props) {
	const { colorMode, toggleColorMode } = useColorMode();

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

				<Spacer />

				<IconButton
					display="flex"
					icon={
						<Icon
							as={
								colorMode === "light"
									? HiOutlineMoon
									: HiOutlineSun
							}
							boxSize="6"
						/>
					}
					alignSelf="flex-end"
					size="sm"
					variant="ghost"
					onClick={() => toggleColorMode()}
					title="Toggle theme"
					aria-label="Toggle theme"
				/>
			</HStack>
		</Box>
	);
}
