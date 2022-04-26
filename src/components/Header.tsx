import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
import {
	HStack,
	Icon,
	IconButton,
	Spacer,
	useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export function Header({ children }: Props) {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<HStack
			position="sticky"
			top="0"
			zIndex="sticky"
			h="12"
			py="3"
			pl={{ base: "8", md: "0" }}
			bg={useDefaultBackgroundColor()}
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
						as={colorMode === "light" ? MoonIcon : SunIcon}
						boxSize="5"
					/>
				}
				alignSelf="flex-end"
				size="xs"
				variant="unstyled"
				onClick={() => toggleColorMode()}
				title="Toggle theme"
				aria-label="Toggle theme"
			/>
		</HStack>
	);
}
