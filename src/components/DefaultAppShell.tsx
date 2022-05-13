import { Box, Stack } from "@chakra-ui/layout";
import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface Props {
	children?: ReactNode;
}

export function DefaultAppShell({ children }: Props) {
	return (
		<Stack
			w="full"
			maxW="4xl"
			mx="auto"
			direction="row"
			px="3"
			pb="3"
			spacing={{ base: "0", md: "2" }}
		>
			<Sidebar />
			<Box as="main" flex="1" w="0">
				{children}
			</Box>
		</Stack>
	);
}
