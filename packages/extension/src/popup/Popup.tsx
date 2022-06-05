import { Spinner } from "@/components/Spinner";
import { isForbiddenUrl } from "@/env";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { BookmarkSaved } from "./components/BookmarkSaved";
import { API_BASE_URL, LOGIN_URL } from "./config";
import { Bookmark, createBookmark } from "./mutations";

async function getCurrentTabUrl() {
	const [tab] = await browser.tabs.query({
		active: true,
		lastFocusedWindow: true,
	});

	const url = tab?.url;

	return url;
}

export function App() {
	const [bookmark, setBookmark] = useState<Bookmark | null>(null);

	useEffect(() => {
		async function saveBookmark() {
			const url = await getCurrentTabUrl();

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
				const bookmark = await createBookmark(url);
				setBookmark(bookmark);
				console.log("Saved bookmark");
			} catch (e) {
				// TODO: handle error
			}
		}

		saveBookmark();
	}, []);

	return (
		<main className="h-[300px] px-4 py-3">
			{!bookmark ? (
				<div className="h-full grid place-items-center">
					<div>
						<Spinner className="w-6 h-6 mx-auto text-gray-600" />
						<div className="text-sm text-gray-400">Saving...</div>
					</div>
				</div>
			) : (
				<BookmarkSaved
					id={bookmark.id}
					title={bookmark.title}
					note={bookmark.note}
				/>
			)}
		</main>
	);
}
