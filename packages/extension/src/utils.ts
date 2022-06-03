export function cn(...values: unknown[]): string {
	return values.filter(v => typeof v === "string").join(" ");
}
