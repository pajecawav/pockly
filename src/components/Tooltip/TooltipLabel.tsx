import { chakra, ChakraProps } from "@chakra-ui/react";
import { Hotkey } from "../Hotkey";

interface Props extends ChakraProps {
	text: string;
	hotkey?: string;
}

export function TooltipLabel({ text, hotkey, ...props }: Props) {
	return (
		<chakra.span color="gray.800" _dark={{ color: "white" }} {...props}>
			{text}
			{hotkey && (
				<>
					{" "}
					&middot; <Hotkey value={hotkey} />
				</>
			)}
		</chakra.span>
	);
}
