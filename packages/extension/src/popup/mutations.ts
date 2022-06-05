import { request, gql } from "graphql-request";
import { GRAPHQL_ENDPOINT_URL } from "./config";

// TODO: set up codegen

export type Bookmark = Awaited<ReturnType<typeof createBookmark>>;

export interface CreateBookmarkMutationResult {
	createBookmark: {
		id: string;
		title: string;
		url: string;
		note: string;
	};
}

export interface CreateBookmarkMutationVariables {
	url: string;
	title?: string;
}

export async function createBookmark(url: string, title?: string) {
	const { createBookmark } = await request<
		CreateBookmarkMutationResult,
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

export interface UpdateBookmarkMutationResult {
	updateBookmark: {
		id: string;
		title: string;
		note: string;
	};
}

export interface UpdateBookmarkMutationVariables {
	id: string;
	title?: string;
	note?: string;
}

export async function updateBookmark({
	id,
	title,
	note,
}: UpdateBookmarkMutationVariables) {
	const { updateBookmark } = await request<
		UpdateBookmarkMutationResult,
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
