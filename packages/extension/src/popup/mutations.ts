import {
	CreateBookmarkMutation,
	CreateBookmarkMutationVariables,
	DeleteBookmarkMutation,
	DeleteBookmarkMutationVariables,
	UpdateBookmarkMutation,
	UpdateBookmarkMutationVariables,
} from "@/__generated__/operations";
import { request, gql } from "graphql-request";
import { GRAPHQL_ENDPOINT_URL } from "./config";

export type Bookmark = Awaited<ReturnType<typeof createBookmark>>;

export async function createBookmark(url: string, title?: string) {
	const { createBookmark } = await request<
		CreateBookmarkMutation,
		CreateBookmarkMutationVariables
	>(
		GRAPHQL_ENDPOINT_URL,
		gql`
			mutation CreateBookmark($url: String!, $title: String) {
				createBookmark(input: { url: $url, title: $title }) {
					id
					title
					url
					note
				}
			}
		`,
		{ url, title }
	);

	return createBookmark;
}

export async function updateBookmark({
	id,
	title,
	note,
}: UpdateBookmarkMutationVariables) {
	const { updateBookmark } = await request<
		UpdateBookmarkMutation,
		UpdateBookmarkMutationVariables
	>(
		GRAPHQL_ENDPOINT_URL,
		gql`
			mutation UpdateBookmark(
				$id: String!
				$title: String
				$note: String
			) {
				updateBookmark(id: $id, input: { title: $title, note: $note }) {
					id
					title
					note
				}
			}
		`,
		{ id, title, note }
	);

	return updateBookmark;
}

export async function deleteBookmark(id: string) {
	const { deleteBookmark } = await request<
		DeleteBookmarkMutation,
		DeleteBookmarkMutationVariables
	>(
		GRAPHQL_ENDPOINT_URL,
		gql`
			mutation DeleteBookmark($id: String!) {
				deleteBookmark(id: $id) {
					id
				}
			}
		`,
		{ id }
	);

	return deleteBookmark;
}
