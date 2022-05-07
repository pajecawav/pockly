import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { TypeOf, ZodSchema } from "zod";

export type InferFormValues<T extends UseFormReturn<any>> =
	T extends UseFormReturn<infer V> ? V : never;

interface UseZodFormArgs<T extends ZodSchema> extends UseFormProps<TypeOf<T>> {
	schema: T;
}

export function useZodForm<T extends ZodSchema>({
	schema,
	...args
}: UseZodFormArgs<T>) {
	return useForm({ resolver: zodResolver(schema), ...args });
}
