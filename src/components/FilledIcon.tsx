import { Icon } from "@chakra-ui/react";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Icon> {
	filled: boolean;
}

export function FilledIcon({ filled, ...props }: Props) {
	// TODO: fix stroke color in dark mode
	return <Icon fill={filled ? "cyan.100" : undefined} {...props} />;
}
