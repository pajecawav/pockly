import {
	EditBookmarkTagsModal_BookmarkFragment,
	GetAllTagsDocument,
	UpdateBookmarkTagsMutation,
	UpdateBookmarkTagsMutationVariables,
} from "@/__generated__/operations";
import { useMutation, useQuery } from "@apollo/client";
import {
	Button,
	chakra,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from "@chakra-ui/react";
import { CreatableSelect, SelectInstance } from "chakra-react-select";
import gql from "graphql-tag";
import { FormEventHandler, useRef } from "react";

interface Props {
	bookmark?: EditBookmarkTagsModal_BookmarkFragment | null;
	onClose: () => void;
}

export const EditBookmarkTagsModal_bookmarkFragment = gql`
	fragment EditBookmarkTagsModal_bookmark on Bookmark {
		id
		tags {
			id
			name
		}
	}
`;

export function EditBookmarkTagsModal({ bookmark, onClose }: Props) {
	const toast = useToast();

	const selectRef = useRef<SelectInstance | null>(null);

	// TODO: is it ok to reuse the query from `/tags` page?
	const { data } = useQuery(GetAllTagsDocument, {
		skip: !bookmark,
	});

	const [mutate, { loading: isMutating }] = useMutation<
		UpdateBookmarkTagsMutation,
		UpdateBookmarkTagsMutationVariables
	>(
		gql`
			mutation UpdateBookmarkTags(
				$id: String!
				$input: UpdateBookmarkTagsInput!
			) {
				updateBookmarkTags(id: $id, input: $input) {
					id
					tags {
						id
						name
					}
				}
			}
		`,
		{
			onCompleted: () => {
				close();
				toast({
					status: "success",
					description: "Updated tags!",
				});
			},
			update: (cache, response) => {
				const tags = response.data?.updateBookmarkTags.tags;
				if (!tags) return;

				cache.updateQuery({ query: GetAllTagsDocument }, data => {
					if (!data) return data;

					const existingTagIds = new Set(
						data.tags.map(tag => tag.id)
					);
					const newTags = tags.filter(
						tag => !existingTagIds.has(tag.id)
					);

					return { ...data, tags: [...data.tags, ...newTags] };
				});
			},
		}
	);

	const createOption = (tag: string) => ({ label: tag, value: tag });

	const close = () => {
		onClose();
	};

	// TODO: integrate with `useZodForm`
	const onSubmit: FormEventHandler = event => {
		event.preventDefault();

		const tags = new FormData(
			event.target as any as HTMLFormElement
		).getAll("tags") as string[];

		mutate({
			variables: {
				id: bookmark!.id,
				input: { tags: tags.filter(Boolean) },
			},
		});
	};

	const isOpen = !!bookmark;

	return (
		<Modal
			isOpen={isOpen}
			onClose={close}
			isCentered
			initialFocusRef={selectRef}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Tags</ModalHeader>

				<ModalCloseButton />

				<ModalBody>
					<chakra.form
						as="form"
						id="edit-tags-form"
						onSubmit={onSubmit}
					>
						<FormControl>
							<FormLabel htmlFor="bookmark-url">Tags</FormLabel>
							{bookmark && (
								<CreatableSelect
									isMulti
									name="tags"
									defaultValue={bookmark.tags.map(tag =>
										createOption(tag.name)
									)}
									options={data?.tags.map(tag =>
										createOption(tag.name)
									)}
									createOptionPosition="last"
									placeholder="Enter tags"
									isClearable={false}
									backspaceRemovesValue={true}
									tabSelectsValue={false}
									escapeClearsValue={false}
									closeMenuOnSelect={true}
									components={{ DropdownIndicator: null }}
									ref={selectRef}
								/>
							)}
						</FormControl>
					</chakra.form>
				</ModalBody>

				<ModalFooter>
					<Button mr={3} variant="outline" size="md" onClick={close}>
						Cancel
					</Button>
					<Button
						size="md"
						type="submit"
						form="edit-tags-form"
						isLoading={isMutating}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
