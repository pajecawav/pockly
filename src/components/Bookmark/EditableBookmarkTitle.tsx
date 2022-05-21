import { useZodForm } from "@/hooks/useZodForm";
import {
	UpdateBookmarkTitleMutation,
	UpdateBookmarkTitleMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	IconButton,
	Input,
	Stack,
	useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import { z } from "zod";
import { Tooltip } from "../Tooltip";
import { TooltipLabel } from "../Tooltip/TooltipLabel";

interface Props {
	id: string;
	title: string;
}

export function EditableBookmarkTitle({ id, title }: Props) {
	const toast = useToast();

	const [isEditing, setIsEditing] = useState(false);

	const form = useZodForm({
		schema: z.object({
			title: z.string().min(1),
		}),
		defaultValues: { title },
	});

	useEffect(() => {
		form.reset({ title });
	}, [title, form]);

	const [mutate, { loading }] = useMutation<
		UpdateBookmarkTitleMutation,
		UpdateBookmarkTitleMutationVariables
	>(
		gql`
			mutation UpdateBookmarkTitle($id: String!, $title: String!) {
				updateBookmark(id: $id, input: { title: $title }) {
					id
					title
				}
			}
		`,
		{
			onCompleted: () => {
				toast({ status: "success", description: "Updated title!" });
				setIsEditing(false);
			},
		}
	);

	return !isEditing ? (
		<Box fontSize="2xl" fontWeight="medium">
			{title}{" "}
			<Tooltip label={<TooltipLabel>Edit title</TooltipLabel>}>
				<IconButton
					icon={<HiOutlinePencil size={16} />}
					aria-label="Edit title"
					onClick={() => setIsEditing(true)}
				/>
			</Tooltip>
		</Box>
	) : (
		<Stack
			as="form"
			direction="row"
			fontSize="lg"
			onSubmit={form.handleSubmit(data => {
				mutate({ variables: { id, title: data.title } });
			})}
		>
			<FormControl isInvalid={!!form.formState.errors.title} w="full">
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

			<Button
				size="md"
				variant="ghost"
				onClick={() => setIsEditing(false)}
			>
				Cancel
			</Button>

			<Button
				type="submit"
				size="md"
				disabled={!form.formState.isDirty}
				isLoading={loading}
			>
				Save
			</Button>
		</Stack>
	);
}
