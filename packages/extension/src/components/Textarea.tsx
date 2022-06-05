import { cn } from "@/utils";
import { ComponentProps } from "react";

export interface TextareaProps extends ComponentProps<"textarea"> {
	className?: string;
}

export function Textarea({ className, ...props }: TextareaProps) {
	return (
		<textarea
			className={cn(
				"rounded-md px-2 py-1 border border-gray-400 focus:border-gray-600",
				className
			)}
			{...props}
		/>
	);
}
