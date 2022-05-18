import {
	EditBookmarkTagsModalQuery,
	EditBookmarkTagsModal_BookmarkFragment,
	namedOperations,
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

const UPDATE_BOOKMARK_TAGS = gql`
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
`;

export function EditBookmarkTagsModal({ bookmark, onClose }: Props) {
	const toast = useToast();

	const selectRef = useRef<SelectInstance | null>(null);

	const { data } = useQuery<EditBookmarkTagsModalQuery>(
		gql`
			query EditBookmarkTagsModalQuery {
				tags {
					id
					name
				}
			}
		`,
		{ skip: !bookmark, fetchPolicy: "cache-and-network" }
	);

	const [mutate, { loading: isMutating }] = useMutation<
		UpdateBookmarkTagsMutation,
		UpdateBookmarkTagsMutationVariables
	>(UPDATE_BOOKMARK_TAGS, {
		// TODO: should invalidate root query `tags` field with `update` method
		// but it doesn't work for some reason
		refetchQueries: [namedOperations.Query.GetAllTags],
		onCompleted: () => {
			close();
			toast({
				status: "success",
				description: "Updated tags!",
			});
		},
	});

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
			// initialFocusRef={selectRef}
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
