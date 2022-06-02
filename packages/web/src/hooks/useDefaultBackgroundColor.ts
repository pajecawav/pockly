import { useColorModeValue } from "@chakra-ui/react";

export function useDefaultBackgroundColor() {
	return useColorModeValue("white", "gray.800");
}
