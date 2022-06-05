import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";
import { Spinner } from "./Spinner";

// TODO: move custom ui components to @pockly/ui package

const buttonClassNames = cva(
	"rounded-md px-3 py-1.5 border-gray-400 focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed",
	{
		variants: {
			variant: {
				solid: "hover:bg-opacity-80 hover:disabled:bg-opacity-100",
			},
			intent: {
				primary: "text-white bg-blue-400",
				danger: "text-white bg-red-500",
			},
		},
		defaultVariants: {
			variant: "solid",
			intent: "primary",
		},
	}
);

export interface ButtonProps
	extends Omit<ComponentProps<"button">, "ref">,
		VariantProps<typeof buttonClassNames> {
	className?: string;
	isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(
		{
			variant,
			intent,
			className,
			isLoading = false,
			disabled,
			children,
			...props
		},
		ref
	) {
		return (
			<button
				className={cn(
					"relative",
					buttonClassNames({ variant, intent }),
					className
				)}
				disabled={disabled || isLoading}
				{...props}
				ref={ref}
			>
				<span className={cn(isLoading && "opacity-0")}>{children}</span>
				{isLoading && (
					<div className="absolute inset-0 grid place-items-center">
						<Spinner className="h-1/2" />
					</div>
				)}
			</button>
		);
	}
);
