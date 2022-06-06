import { Spinner } from "@/components/Spinner";
import { isForbiddenUrl } from "@/env";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { BookmarkSaved } from "../components/BookmarkSaved";
import { LOGIN_URL, SESSION_URL } from "../config";
import { Bookmark, createBookmark } from "../mutations";
import { getCurrentTabUrl } from "../utils";
import { Center } from "./Center";

export function Root() {
	const [bookmark, setBookmark] = useState<Bookmark | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function saveBookmark() {
			const url = await getCurrentTabUrl();

			if (!url || isForbiddenUrl(url)) {
				console.log(`Forbidden url ${url}`);
				// TODO: close popup
				return;
			}

			const response = await fetch(SESSION_URL);
			if (!response.ok) {
				console.error(
					`Failed to fetch session: ${response.status} ${response.statusText}`
				);
				setError("Failed to fetch session information.");
				return;
			}

			const session = await response.json();

			if (Object.keys(session).length === 0) {
				console.log("Not authenticated. Opening login page...");
				const loginUrl = new URL(LOGIN_URL);
				loginUrl.searchParams.append(
					"next",
					`/_share?url=${encodeURIComponent(url)}`
				);
				browser.tabs.create({ url: loginUrl.toString() });
				return;
			}

			try {
				const bookmark = await createBookmark(url);
				setBookmark(bookmark);
				console.log("Saved bookmark");
			} catch (e) {
				setError("Failed to save bookmark.");
				console.error(JSON.stringify(e));
			}
		}

		saveBookmark();
	}, []);

	if (error) {
		return (
			<Center className="h-full">
				<div className="text-red-500 text-lg">{error}</div>
			</Center>
		);
	}

	if (!bookmark) {
		return (
			<Center className="h-full">
				<div>
					<Spinner className="w-6 h-6 mx-auto text-gray-600" />
					<div className="text-sm text-gray-400">Saving...</div>
				</div>
			</Center>
		);
	}

	return <BookmarkSaved bookmark={bookmark} />;
}
