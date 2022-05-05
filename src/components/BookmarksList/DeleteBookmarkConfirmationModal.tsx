import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Text,
} from "@chakra-ui/react";
import { useRef } from "react";

interface Props {
	isOpen: boolean;
	isDeleting?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export function DeleteBookmarkConfirmationModal({
	isOpen,
	isDeleting,
	onConfirm,
	onClose,
}: Props) {
	const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

	return (
		<AlertDialog
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			// delete button is not really a 'least destructive' button but it's
			// more intuitive
			leastDestructiveRef={deleteButtonRef}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader>Delete Bookmark</AlertDialogHeader>

					<AlertDialogBody>
						<Text>
							Are you sure you want to delete this bookmark? This
							cannot be undone.
						</Text>
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button
							mr={3}
							variant="outline"
							size="md"
							onClick={onClose}
							_focus={{ boxShadow: "outline" }}
						>
							Cancel
						</Button>
						<Button
							size="md"
							colorScheme="red"
							isLoading={isDeleting}
							_focus={{ boxShadow: "outline" }}
							onClick={() => onConfirm()}
							ref={deleteButtonRef}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
}
