import { Box, Icon, Select, SelectProps, useColorMode } from "@chakra-ui/react";
import { HiOutlineMoon, HiOutlineSelector, HiOutlineSun } from "react-icons/hi";

interface Props extends Pick<SelectProps, "size"> {}

// TODO: how to set colorMode value to `theme`? Looks like Chakra doesn't
// support this
export function ThemeSelect({ ...props }: Props) {
	const { colorMode, setColorMode } = useColorMode();

	return (
		<Box position="relative">
			<Box
				position="absolute"
				left="1.5"
				h="full"
				w="6"
				display="inline-flex"
				alignItems="center"
				justifyContent="center"
				color="gray.500"
			>
				<Icon
					as={colorMode === "dark" ? HiOutlineMoon : HiOutlineSun}
					boxSize="4"
				/>
			</Box>
			<Select
				variant="outline"
				size="sm"
				w="28"
				rounded="md"
				value={colorMode}
				onChange={e => setColorMode(e.target.value)}
				sx={{
					// TODO: fix this ugliness
					".chakra-select__wrapper &": {
						paddingStart: "8",
					},
				}}
				{...props}
				iconColor="gray.500"
				icon={<Icon as={HiOutlineSelector} boxSize="4" />}
			>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</Select>
		</Box>
	);
}
