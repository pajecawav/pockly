import { chakra } from "@chakra-ui/react";
import { Kbd } from "./Kbd";

interface Props {
	value: string;
}

export function Hotkey({ value }: Props) {
	const [first, second] = value.split(" ");

	if (!second) {
		return <Kbd>{first}</Kbd>;
	}

	return (
		<>
			<Kbd>{first}</Kbd>{" "}
			<chakra.span
				color="gray.700"
				fontWeight="light"
				_dark={{ color: "gray.300" }}
			>
				then
			</chakra.span>{" "}
			<Kbd>{second}</Kbd>
		</>
	);
}
