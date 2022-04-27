import { Icon } from "@chakra-ui/react";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Icon> {
	filled: boolean;
}

export function FilledIcon({ filled, ...props }: Props) {
	return (
		<Icon
			fill={filled ? "cyan.100" : undefined}
			stroke={filled ? "black" : undefined}
			{...props}
		/>
	);
}
