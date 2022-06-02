import { Center, CenterProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props extends CenterProps {
	children: ReactNode;
}

export function Empty({ children, ...props }: Props) {
	return (
		<Center
			h="40"
			fontSize="xl"
			color="lightslategray"
			borderBottom="1px"
			borderColor="gray.100"
			_dark={{ borderColor: "gray.700" }}
			{...props}
		>
			{children}
		</Center>
	);
}
