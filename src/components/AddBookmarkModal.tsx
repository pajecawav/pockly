import { useZodForm } from "@/hooks/useZodForm";
import { bookmarkTitleSchema, bookmarkUrlSchema } from "@/lib/schemas";
import {
	CreateBookmarkMutation,
	CreateBookmarkMutationVariables,
	GetUnreadBookmarksDocument,
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
import { useRef } from "react";
import { z } from "zod";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

// TODO: figure out how to keep required data fragment in sync with `GetUnreadBookmarksQuery`;
const CREATE_BOOKMARK = gql`
	mutation CreateBookmark($input: CreateBookmarkInput!) {
		createBookmark(input: $input) {
			id
			title
			liked
			archived
			url
			addedAt
			image
			tags {
				id
				name
			}
		}
	}
`;

export function AddBookmarkModal({ isOpen, onClose }: Props) {
	const toast = useToast();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const form = useZodForm({
		schema: z.object({
			url: bookmarkUrlSchema,
			title: bookmarkTitleSchema,
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
		update: (cache, response) => {
			if (!response.data) return;

			const newBookmark = response.data.createBookmark;

			cache.updateQuery(
				{
					query: GetUnreadBookmarksDocument,
					// TODO: also append to the end if `oldestFirst` is true
					variables: { oldestFirst: false },
				},
				data => {
					if (!data) return data;

					let { edges, pageInfo } = data.bookmarks;
					edges = edges.filter(
						edge => edge.node.id !== newBookmark.id
					);
					edges.unshift({
						node: newBookmark,
						__typename: "QueryBookmarksConnectionEdge" as const,
					});

					return {
						...data,
						bookmarks: {
							edges,
							pageInfo,
							__typename: "QueryBookmarksConnection" as const,
						},
					};
				}
			);
		},
	});

	const close = () => {
		onClose();
		form.reset();
	};

	const { ref: urlInputRef, ...urlInputProps } = form.register("url");

	return (
		<Modal
			isOpen={isOpen}
			onClose={close}
			isCentered
			initialFocusRef={inputRef}
		>
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
								{...urlInputProps}
								ref={instance => {
									urlInputRef(instance);
									inputRef.current = instance;
								}}
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
						Cancel
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
