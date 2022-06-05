import { cn } from "@/utils";
import { ComponentProps } from "react";

export interface InputProps extends ComponentProps<"input"> {
	className?: string;
}

export function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={cn(
				"rounded-md px-2 py-1 border border-gray-400 focus:border-gray-600",
				className
			)}
			{...props}
		/>
	);
}
