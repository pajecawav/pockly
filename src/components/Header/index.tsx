import { useDefaultBackgroundColor } from "@/hooks/useDefaultBackgroundColor";
import { HStack } from "@chakra-ui/react";
import { useContext } from "react";
import { HeaderContext } from "./HeaderPortal";

export { HeaderPortal, HeaderProvider } from "./HeaderPortal";

export const HEADER_HEIGHT = "14";

export function Header() {
	const [, setHeader] = useContext(HeaderContext);

	return (
		<HStack
			position="sticky"
			top="0"
			h={HEADER_HEIGHT}
			zIndex="sticky"
			pl={{ base: "10", md: "0" }}
			py="3"
			bg={useDefaultBackgroundColor()}
			borderBottom="1px"
			borderColor="gray.100"
			_dark={{ borderColor: "gray.700" }}
			fontWeight="semibold"
			ref={setHeader}
		/>
	);
}
