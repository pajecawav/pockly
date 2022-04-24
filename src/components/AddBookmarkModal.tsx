import { useZodForm } from "@/hooks/useZodForm";
import {
	CreateBookmarkMutation,
	CreateBookmarkMutationVariables,
	namedOperations,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import {
	Button,
	chakra,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRef } from "react";
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
	const form = useZodForm({
		schema: object({
			url: string().url(),
			// TODO: make optional after implementing automatic metadata fetching on backend
			title: string().min(1).max(100),
		}),
	});

	const [createBookmark, { loading }] = useMutation<
		CreateBookmarkMutation,
		CreateBookmarkMutationVariables
	>(CREATE_BOOKMARK, {
		onCompleted: () => close(),
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
					<chakra.form
						id="add-bookmark-form"
						onSubmit={form.handleSubmit(values => {
							createBookmark({
								variables: { input: values },
							});
						})}
						display="grid"
						rowGap={2}
						columnGap={4}
						alignItems="center"
						gridTemplateColumns="max-content auto"
					>
						<label htmlFor="bookmark-url">URL</label>
						<Input
							id="bookmark-url"
							type="url"
							required
							placeholder="https://..."
							isInvalid={
								form.formState.touchedFields.url &&
								!!form.formState.errors.url
							}
							{...form.register("url")}
						/>

						<label htmlFor="bookmark-title">Title</label>
						<Input
							id="bookmark-title"
							type="title"
							placeholder="Title"
							isInvalid={
								form.formState.touchedFields.title &&
								!!form.formState.errors.title
							}
							{...form.register("title")}
						/>
					</chakra.form>
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
