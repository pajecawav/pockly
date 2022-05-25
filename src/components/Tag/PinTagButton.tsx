import { usePinnedTagsStore } from "@/stores/usePinnedTagsStore";
import { Icon, IconButton, IconButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import { AiFillPushpin, AiOutlinePushpin } from "react-icons/ai";

interface PinTagButtonProps extends Omit<IconButtonProps, "aria-label"> {
	tag: string;
}

export const PinTagButton = forwardRef<HTMLButtonElement, PinTagButtonProps>(
	function PinTagButton({ tag, ...props }, ref) {
		const { isTagPinned, pinTag, unpinTag } = usePinnedTagsStore();
		const isPinned = tag && isTagPinned(tag);

		function handleClick() {
			if (isPinned) {
				unpinTag(tag);
			} else {
				pinTag(tag);
			}
		}

		return (
			<IconButton
				{...props}
				icon={
					<Icon
						as={isPinned ? AiFillPushpin : AiOutlinePushpin}
						boxSize="5"
					/>
				}
				variant="ghost"
				size="sm"
				aria-label={isPinned ? "Unpin tag" : "Pin tag"}
				onClick={handleClick}
				ref={ref}
			/>
		);
	}
);
