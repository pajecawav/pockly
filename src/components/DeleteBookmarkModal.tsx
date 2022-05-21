import {
	DeleteBookmarkMutation,
	DeleteBookmarkMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Text,
	useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRef } from "react";

interface Props {
	bookmarkId?: string | null;
	onClose: () => void;
	afterDelete?: () => void;
}

export function DeleteBookmarkConfirmationModal({
	bookmarkId,
	onClose,
	afterDelete,
}: Props) {
	const toast = useToast();

	const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

	const [mutateDelete, { loading: isDeleting }] = useMutation<
		DeleteBookmarkMutation,
		DeleteBookmarkMutationVariables
	>(
		gql`
			mutation DeleteBookmark($id: String!) {
				deleteBookmark(id: $id) {
					id
				}
			}
		`,
		{
			optimisticResponse: vars => ({ deleteBookmark: { id: vars.id } }),
			onCompleted: () => {
				toast({
					status: "success",
					description: "Deleted bookmark!",
				});
				(afterDelete || onClose)();
			},
			update: (cache, result) => {
				if (result.data?.deleteBookmark) {
					cache.evict({
						id: cache.identify(result.data.deleteBookmark),
					});
				}
			},
		}
	);

	const handleDelete = () => {
		if (bookmarkId) {
			mutateDelete({
				variables: { id: bookmarkId },
			});
		}
	};

	return (
		<AlertDialog
			isOpen={!!bookmarkId}
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
							onClick={handleDelete}
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
