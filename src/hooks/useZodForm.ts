import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import { TypeOf, ZodSchema } from "zod";

interface UseZodFormArgs<T extends ZodSchema> extends UseFormProps<TypeOf<T>> {
	schema: T;
}

export function useZodForm<T extends ZodSchema>({
	schema,
	...args
}: UseZodFormArgs<T>) {
	return useForm({ resolver: zodResolver(schema), ...args });
}
