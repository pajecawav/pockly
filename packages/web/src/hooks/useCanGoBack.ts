export function useCanGoBack() {
	if (typeof window === "undefined") {
		return null;
	}

	// TODO: some new nextjs removed idx from state so this stopped working
	const pageIndex = window.history.state.idx as number;
	const canGoBack = pageIndex > 0;

	return canGoBack;
}
