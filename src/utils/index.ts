export function cn(...values: any[]): string {
	return values.filter(value => typeof value === "string" && value).join(" ");
}

export function getHostnameFromUrl(url: string): string {
	return new URL(url).hostname;
}
