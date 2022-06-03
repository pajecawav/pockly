export interface LogoProps {
	className?: string;
}

export function Logo({ className }: LogoProps) {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			stroke="currentColor"
			fill="none"
			strokeWidth="1"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
			/>
		</svg>
	);
}
