import { FilledIcon } from "@/components/FilledIcon";
import { As, IconButton, IconButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface BookmarkActionButtonProps
	extends Omit<IconButtonProps, "icon"> {
	icon: As<any>;
	// TODO: remove `hotkey` prop and pass `data-hotkey` directly instead
	hotkey?: string;
	filled?: boolean;
}

export const BookmarkActionButton = forwardRef<
	HTMLButtonElement,
	BookmarkActionButtonProps
>(function BookmarkActionButton(
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
});
