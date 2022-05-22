import { useZodForm } from "@/hooks/useZodForm";
import {
	BookmarkEditFormMutation,
	BookmarkEditFormMutationVariables,
	BookmarkEditForm_BookmarkFragment,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Spacer,
	Stack,
	useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useEffect } from "react";
import { z } from "zod";
import { HeaderPortal } from "../Header";
import { TextareaAutosize } from "../TextareaAutosize";

interface Props {
	bookmark: BookmarkEditForm_BookmarkFragment;
	onDone?: () => void;
}

export const BookmarkEditForm_bookmarkFragment = gql`
	fragment BookmarkEditForm_bookmark on Bookmark {
		id
		title
		note
	}
`;

const schema = z.object({
	// TODO: use actual `max` values from backend
	title: z.string().max(100).min(1),
	note: z.string().max(5000).optional(),
});
type Schema = z.infer<typeof schema>;

export function BookmarkEditForm({ bookmark, onDone }: Props) {
	const toast = useToast();

	const form = useZodForm({
		schema,
		defaultValues: { note: bookmark.note ?? "", title: bookmark.title },
	});

	useEffect(() => {
		form.reset({ title: bookmark.title, note: bookmark.note ?? "" });
	}, [bookmark, form]);

	const [mutate, { loading }] = useMutation<
		BookmarkEditFormMutation,
		BookmarkEditFormMutationVariables
	>(
		gql`
			mutation BookmarkEditFormMutation(
				$id: String!
				$title: String!
				$note: String
			) {
				updateBookmark(id: $id, input: { title: $title, note: $note }) {
					id
					title
					note
				}
			}
		`,
		{
			onCompleted: data => {
				const { title, note } = data.updateBookmark;
				form.reset({ title, note: note ?? "" });
				toast({
					status: "success",
					description: "Successfully updated bookmark!",
				});
				onDone?.();
			},
		}
	);

	const handleSubmit = (values: Schema) => {
		mutate({
			variables: {
				id: bookmark.id,
				title: values.title,
				note: values.note,
			},
		});
	};

	return (
		<Stack
			as="form"
			id="edit-bookmark-form"
			direction="column"
			fontSize="lg"
			onSubmit={form.handleSubmit(handleSubmit)}
		>
			<FormControl isInvalid={!!form.formState.errors.title} w="full">
				<FormLabel>Title</FormLabel>
				<Input
					{...form.register("title")}
					isInvalid={!!form.formState.errors.title}
					required
				/>
				{form.formState.errors.title?.message && (
					<FormErrorMessage>
						{form.formState.errors.title.message}
					</FormErrorMessage>
				)}
			</FormControl>

			<FormControl isInvalid={!!form.formState.errors.note} w="full">
				<FormLabel>Note</FormLabel>
				<TextareaAutosize
					w="full"
					{...form.register("note")}
					minRows={5}
					isInvalid={!!form.formState.errors.note}
				/>
				{form.formState.errors.note?.message && (
					<FormErrorMessage>
						{form.formState.errors.note.message}
					</FormErrorMessage>
				)}
			</FormControl>

			<HeaderPortal>
				<Spacer />

				<Button size="sm" variant="ghost" onClick={() => onDone?.()}>
					Cancel
				</Button>

				<Button
					type="submit"
					form="edit-bookmark-form"
					size="sm"
					disabled={!form.formState.isDirty}
					isLoading={loading}
				>
					Save
				</Button>
			</HeaderPortal>
		</Stack>
	);
}
