import { useZodForm } from "@/hooks/useZodForm";
import { bookmarkNoteSchema, bookmarkTitleSchema } from "@/lib/schemas";
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
	useEventListener,
	useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useEffect, useRef } from "react";
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
	title: bookmarkTitleSchema,
	note: bookmarkNoteSchema.optional(),
});
type Schema = z.infer<typeof schema>;

export function BookmarkEditForm({ bookmark, onDone }: Props) {
	const toast = useToast();

	const formRef = useRef<HTMLFormElement | null>(null);

	const form = useZodForm({
		schema,
		defaultValues: { note: bookmark.note ?? "", title: bookmark.title },
	});

	useEventListener("keydown", e => {
		if (
			e.key === "Escape" &&
			(!form.formState.isDirty ||
				confirm("Are you sure you want to discard changes?"))
		) {
			onDone?.();
		}
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

	// TODO: figure out how to ignore events fired from modals
	// submit form on ctrl-s
	useEffect(() => {
		function handler(e: KeyboardEvent) {
			if (e.ctrlKey && e.key === "s") {
				e.preventDefault();

				if (form.formState.isDirty) {
					formRef.current?.requestSubmit();
				} else {
					onDone?.();
				}
			}
		}

		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [form, onDone]);

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
			ref={formRef as any}
		>
			<FormControl isInvalid={!!form.formState.errors.title} w="full">
				<FormLabel srOnly>Title</FormLabel>
				<Input
					{...form.register("title")}
					isInvalid={!!form.formState.errors.title}
					required
					autoFocus
				/>
				{form.formState.errors.title?.message && (
					<FormErrorMessage>
						{form.formState.errors.title.message}
					</FormErrorMessage>
				)}
			</FormControl>

			<FormControl isInvalid={!!form.formState.errors.note} w="full">
				<FormLabel srOnly>Note</FormLabel>
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
