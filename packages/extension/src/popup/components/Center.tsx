import { cn } from "@/utils";
import { ReactNode } from "react";

export interface CenterProps {
	className?: string;
	children?: ReactNode;
}

export function Center({ className, children }: CenterProps) {
	return (
		<div className={cn("flex items-center justify-center", className)}>
			{children}
		</div>
	);
}
