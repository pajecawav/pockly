import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
import { Box, HStack } from "@chakra-ui/react";
import { useContext } from "react";
import { HeaderContext } from "./HeaderPortal";

export { HeaderPortal, HeaderProvider } from "./HeaderPortal";

export const HEADER_HEIGHT = "14";

export function Header() {
	const [, setHeader] = useContext(HeaderContext);

	return (
		<Box
			position="sticky"
			top="0"
			bg={useDefaultBackgroundColor()}
			zIndex="sticky"
			mx="-2"
		>
			{/* TODO: remove this element */}
			<HStack
				h={HEADER_HEIGHT}
				pl={{ base: "10", md: "0" }}
				py="3"
				mx="2"
				borderBottom="1px"
				borderColor="gray.100"
				_dark={{ borderColor: "gray.700" }}
				fontWeight="semibold"
				ref={setHeader}
			/>
		</Box>
	);
}
