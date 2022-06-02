import { Icon } from "@chakra-ui/react";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Icon> {
	filled: boolean;
}

export function FilledIcon({ filled, ...props }: Props) {
	return (
		<Icon
			fill={filled ? "cyan.100" : undefined}
			_dark={{ stroke: filled ? "whiteAlpha.700" : undefined }}
			{...props}
		/>
	);
}
