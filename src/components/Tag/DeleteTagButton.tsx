import { Icon, IconButton, IconButtonProps } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { DeleteTagModal } from "./DeleteTagModal";

interface DeleteTagButtonProps extends Omit<IconButtonProps, "aria-label"> {
	tag: string;
	afterDelete?: () => void;
}

export const DeleteTagButton = forwardRef<
	HTMLButtonElement,
	DeleteTagButtonProps
>(function DeleteTagButton({ tag, afterDelete, ...props }, ref) {
	const [isDeleting, setIsDeleting] = useState(false);

	return (
		<>
			<IconButton
				{...props}
				icon={<Icon as={HiOutlineTrash} boxSize="5" />}
				variant="ghost"
				size="sm"
				aria-label="Delete tag"
				onClick={() => setIsDeleting(true)}
				ref={ref}
			/>
			<DeleteTagModal
				tag={isDeleting ? tag : null}
				onClose={() => setIsDeleting(false)}
				afterDelete={afterDelete}
			/>
		</>
	);
});
