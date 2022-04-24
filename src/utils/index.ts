export function cn(...values: any[]): string {
	return values.filter(value => typeof value === "string" && value).join(" ");
}
