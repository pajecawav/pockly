import { cn } from "@/utils";

export interface SpinnerProps {
	className?: string;
}

export function Spinner({ className }: SpinnerProps) {
	return (
		<svg
			className={cn("animate-spin", className)}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10" />
		</svg>
	);
}
