import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
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
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			initialFocusRef={deleteButtonRef}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delete Bookmark</ModalHeader>

				<ModalCloseButton />

				<ModalBody>
					<Text>
						Are you sure you want to delete this bookmark? This
						cannot be undone.
					</Text>
				</ModalBody>

				<ModalFooter>
					<Button
						mr={3}
						variant="outline"
						size="md"
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						size="md"
						colorScheme="red"
						isLoading={isDeleting}
						ref={deleteButtonRef}
						onClick={() => onConfirm()}
					>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
