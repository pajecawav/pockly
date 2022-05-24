export function useCanGoBack() {
	if (typeof window === "undefined") {
		return null;
	}

	const pageIndex = window.history.state.idx as number;
	const canGoBack = pageIndex > 0;

	return canGoBack;
}
