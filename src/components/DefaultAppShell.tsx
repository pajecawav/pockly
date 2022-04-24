import { Box, Stack } from "@chakra-ui/layout";
import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface Props {
	children?: ReactNode;
}

export function DefaultAppShell({ children }: Props) {
	return (
		<Stack w="full" maxW="4xl" mx="auto" direction="row" spacing="0">
			<Sidebar />
			<Box flex="1" w="0">
				{children}
			</Box>
		</Stack>
	);
}
