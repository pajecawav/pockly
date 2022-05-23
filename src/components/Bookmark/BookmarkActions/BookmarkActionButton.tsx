import { FilledIcon } from "@/components/FilledIcon";
import { As, IconButton, IconButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface Props extends Omit<IconButtonProps, "icon"> {
	icon: As<any>;
	hotkey?: string;
	filled?: boolean;
}

export const BookmarkActionButton = forwardRef<HTMLButtonElement, Props>(
	function BookmarkActionButton(
		{ icon, hotkey, filled = false, ...props },
		ref
	) {
		return (
			<IconButton
				icon={<FilledIcon as={icon} boxSize="6" filled={filled} />}
				variant="ghost"
				size="sm"
				data-hotkey={hotkey}
				{...props}
				ref={ref}
			/>
		);
	}
);