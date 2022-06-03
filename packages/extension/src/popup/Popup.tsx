import { Spinner } from "@/components/Spinner";
import { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import { isForbiddenUrl } from "@/env";
import { Logo } from "@/components/Logo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GRAPHQL_ENDPOINT_URL = `${API_BASE_URL}/api/graphql`;

const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const READING_LIST_URL = `${API_BASE_URL}/read`;
const BOOKMARK_PAGE_BASE_URL = `${API_BASE_URL}/b`;

// TODO: proper types generation

const SAVE_BOOKMARK_MUTATION = gql`
	mutation SaveBookmark($url: String!) {
		createBookmark(input: { url: $url }) {
			id
			title
			url
		}
	}
`;

interface SaveBookmarkMutationResult {
	createBookmark: {
		id: string;
		title: string;
		url: string;
	};
}

interface SaveBookmarkMutationVariables {
	url: string;
}

export function App() {
	const [bookmark, setBookmark] = useState<
		SaveBookmarkMutationResult["createBookmark"] | null
	>(null);

	useEffect(() => {
		async function saveBookmark() {
			const [tab] = await browser.tabs.query({
				active: true,
				lastFocusedWindow: true,
			});

			const url = tab?.url;

			if (!url || isForbiddenUrl(url)) {
				console.log(`Forbidden url ${url}`);
				// TODO: close popup
				return;
			}

			// TODO: error handling
			const response = await fetch(`${API_BASE_URL}/api/auth/session`);
			const sessionJson = await response.json();

			if (Object.keys(sessionJson).length === 0) {
				console.log("Not authenticated. Opening login page...");
				browser.tabs.create({ url: LOGIN_URL });
				return;
			}

			try {
				const { createBookmark } = await request<
					SaveBookmarkMutationResult,
					SaveBookmarkMutationVariables
				>(GRAPHQL_ENDPOINT_URL, SAVE_BOOKMARK_MUTATION, { url });
				setBookmark(createBookmark);
				console.log("Saved bookmark");
			} catch (e) {
				// TODO: handle error
			}
		}

		saveBookmark();
	}, []);

	return (
		<main className="px-2 py-3">
			<div className="flex gap-2">
				<Logo className="w-14 h-14 text-blue-400" />
				<div className="flex-grow">
					{!bookmark ? (
						<div className="text-lg">
							Saving... <Spinner className="inline w-4 h-4" />
						</div>
					) : (
						<>
							<div className="text-lg">Saved to Pockly</div>
							<div className="text-sm">
								<a
									className="text-blue-500"
									href={READING_LIST_URL}
								>
									Reading List
								</a>
								<span className="text-black"> | </span>
								<a
									className="text-blue-500"
									href={`${BOOKMARK_PAGE_BASE_URL}/${bookmark.id}`}
								>
									Bookmark Page
								</a>
							</div>
						</>
					)}
				</div>
			</div>
		</main>
	);
}
