export function cleanUrl(url: string): string {
	const u = new URL(url);

	const params = Array.from(u.searchParams.keys());
	for (const param of params) {
		if (param.startsWith("utm_")) {
			u.searchParams.delete(param);
		}
	}

	return u.toString();
}
