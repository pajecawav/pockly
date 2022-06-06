import { Box, Center, GridProps, Image } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
	title: string;
	src?: string | null;
}

const backgroundColors: GridProps["bg"][][] = [
	["red.100", "red.700"],
	["green.100", "green.700"],
	["orange.100", "orange.500"],
];

export function BookmarkImage({ title, src }: Props) {
	// HACK: Chakra Image ignores fallback when loading="lazy"
	// (https://github.com/chakra-ui/chakra-ui/pull/1012)
	const [isError, setIsError] = useState<boolean>(false);

	const letter = title.toUpperCase().match(/[A-Z]/)?.[0];

	const colorIndex = title.length % backgroundColors.length;

	return (
		<Box
			w="14"
			h="9"
			position="relative"
			rounded="md"
			overflow="hidden"
			bg={backgroundColors[colorIndex][0]}
			_dark={{ bg: backgroundColors[colorIndex][1] }}
		>
			<Center
				position="absolute"
				inset="0"
				fontSize="lg"
				fontFamily="serif"
				color={backgroundColors[colorIndex][1]}
				_dark={{ color: backgroundColors[colorIndex][0] }}
				aria-hidden="true"
			>
				{letter}
			</Center>
			{src && !isError && (
				<Image
					bg={backgroundColors[colorIndex][0]}
					position="absolute"
					w="full"
					h="full"
					fit="cover"
					src={src}
					alt=""
					loading="lazy"
					onError={() => setIsError(true)}
				/>
			)}
		</Box>
	);
}
