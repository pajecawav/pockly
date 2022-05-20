import { useZodForm } from "@/hooks/useZodForm";
import {
	UpdateBookmarkNoteMutation,
	UpdateBookmarkNoteMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	Stack,
	useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { z } from "zod";
import { TextareaAutosize } from "./TextareaAutosize";

interface Props {
	id: string;
	note?: string | null;
}

export function EditableBookmarkNote({ id, note }: Props) {
	const toast = useToast();

	const form = useZodForm({
		schema: z.object({
			note: z.string().max(5000),
		}),
		defaultValues: { note: note ?? "" },
	});

	const [mutate, { loading }] = useMutation<
		UpdateBookmarkNoteMutation,
		UpdateBookmarkNoteMutationVariables
	>(
		gql`
			mutation UpdateBookmarkNote($id: String!, $note: String!) {
				updateBookmark(id: $id, input: { note: $note }) {
					id
					note
				}
			}
		`,
		{
			onCompleted: data => {
				form.reset({ note: data.updateBookmark.note ?? "" });
				toast({ status: "success", description: "Saved note!" });
			},
		}
	);

	return (
		<Stack
			as="form"
			direction="column"
			fontSize="lg"
			onSubmit={form.handleSubmit(data => {
				mutate({ variables: { id, note: data.note } });
			})}
		>
			<FormControl isInvalid={!!form.formState.errors.note} w="full">
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

			<Box alignSelf="end">
				<Button
					type="submit"
					size="md"
					disabled={!form.formState.isDirty}
					isLoading={loading}
				>
					Save
				</Button>
			</Box>
		</Stack>
	);
}
