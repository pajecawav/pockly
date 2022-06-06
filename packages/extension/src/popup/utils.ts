import browser from "webextension-polyfill";

export async function getCurrentTabUrl() {
	const [tab] = await browser.tabs.query({
		active: true,
		lastFocusedWindow: true,
	});

	const url = tab?.url;

	return url;
}
