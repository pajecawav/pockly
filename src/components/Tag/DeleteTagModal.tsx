import { usePinnedTagsStore } from "@/stores/usePinnedTagsStore";
import {
	DeleteTagButtonMutation,
	DeleteTagButtonMutationVariables,
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
	chakra,
	Text,
	useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRef } from "react";

interface Props {
	tag?: string | null;
	onClose: () => void;
	afterDelete?: () => void;
}

export function DeleteTagModal({ tag, onClose, afterDelete }: Props) {
	const toast = useToast();
	const unpinTag = usePinnedTagsStore(store => store.unpinTag);

	const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

	const [mutate, { loading: isDeleting }] = useMutation<
		DeleteTagButtonMutation,
		DeleteTagButtonMutationVariables
	>(
		gql`
			mutation DeleteTagButtonMutation($tag: String!) {
				deleteTag(tag: $tag) {
					id
					name
				}
			}
		`,
		{
			onCompleted: () => {
				if (tag) unpinTag(tag);
				toast({
					status: "success",
					description: "Deleted tag!",
				});
				(afterDelete || onClose)?.();
			},
			update: (cache, response) => {
				const deletedTag = response.data?.deleteTag;
				if (deletedTag) {
					cache.evict({
						id: cache.identify(deletedTag),
					});
				}
			},
		}
	);

	function handleDelete() {
		if (tag) {
			mutate({ variables: { tag } });
		}
	}

	return (
		<AlertDialog
			isOpen={!!tag}
			onClose={onClose}
			isCentered
			leastDestructiveRef={deleteButtonRef}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader>Delete Tag</AlertDialogHeader>

					<AlertDialogBody>
						<Text>
							Delete tag{" "}
							<chakra.span fontWeight="bold">{tag}</chakra.span>?
							Deleting the tag will remove it from all items. Are
							you sure you want to proceed?
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
