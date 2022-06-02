import { Textarea, TextareaProps } from "@chakra-ui/react";
import React from "react";
import ResizeTextarea, {
	TextareaAutosizeProps as ResizeTextareaProps,
} from "react-textarea-autosize";

export const TextareaAutosize = React.forwardRef<
	HTMLTextAreaElement,
	TextareaProps | ResizeTextareaProps
>(function TextareaAutosize(props, ref) {
	return (
		<Textarea
			minH="unset"
			overflow="hidden"
			w="full%"
			resize="none"
			ref={ref}
			minRows={1}
			as={ResizeTextarea}
			{...props}
		/>
	);
});
