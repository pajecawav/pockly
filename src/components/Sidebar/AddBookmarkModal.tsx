import { useZodForm } from "@/hooks/useZodForm";
import { optionalTextInputSchema } from "@/utils/schemas";
import {
	CreateBookmarkMutation,
	CreateBookmarkMutationVariables,
	namedOperations,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { object, string } from "zod";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const CREATE_BOOKMARK = gql`
	mutation CreateBookmark($input: CreateBookmarkInput!) {
		createBookmark(input: $input) {
			id
			url
			title
			liked
			archived
		}
	}
`;

export function AddBookmarkModal({ isOpen, onClose }: Props) {
	const toast = useToast();

	const form = useZodForm({
		schema: object({
			url: string().url(),
			title: optionalTextInputSchema(string().min(1).max(100)),
		}),
		reValidateMode: "onSubmit",
	});

	const [createBookmark, { loading }] = useMutation<
		CreateBookmarkMutation,
		CreateBookmarkMutationVariables
	>(CREATE_BOOKMARK, {
		onCompleted: () => {
			close();
			toast({
				status: "success",
				description: "Saved bookmark!",
			});
		},
		// TODO: update cached data instead of refetching
		refetchQueries: [namedOperations.Query.GetUnreadBookmarks],
	});

	const close = () => {
		onClose();
		form.reset();
	};

	return (
		<Modal isOpen={isOpen} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Bookmark</ModalHeader>

				<ModalCloseButton />

				<ModalBody>
					<Stack
						as="form"
						id="add-bookmark-form"
						onSubmit={form.handleSubmit(values => {
							createBookmark({
								variables: { input: values },
							});
						})}
					>
						<FormControl isInvalid={!!form.formState.errors.url}>
							<FormLabel htmlFor="bookmark-url">URL</FormLabel>
							<Input
								id="bookmark-url"
								type="url"
								required
								placeholder="https://..."
								{...form.register("url")}
							/>
							<FormErrorMessage>
								{form.formState.errors.url?.message}
							</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={!!form.formState.errors.title}>
							<FormLabel htmlFor="bookmark-title">
								Title
							</FormLabel>
							<Input
								id="bookmark-title"
								type="title"
								placeholder="(Optional)"
								{...form.register("title")}
							/>
							<FormErrorMessage>
								{form.formState.errors.title?.message}
							</FormErrorMessage>
						</FormControl>
					</Stack>
				</ModalBody>

				<ModalFooter>
					<Button mr={3} variant="outline" size="md" onClick={close}>
						Close
					</Button>
					<Button
						size="md"
						type="submit"
						form="add-bookmark-form"
						isLoading={loading}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
