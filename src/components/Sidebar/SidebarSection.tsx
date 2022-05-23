import { Stack } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

interface Props {
	children?: ReactNode;
}

export const SidebarSection = forwardRef<HTMLDivElement, Props>(
	function SidebarSection({ children }, ref) {
		return (
			<Stack direction="column" spacing="0.5" ref={ref}>
				{children}
			</Stack>
		);
	}
);
