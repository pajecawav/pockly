import { Box, Stack } from "@chakra-ui/layout";
import React, { ReactNode } from "react";
import { Header, HeaderProvider } from "./Header";
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
			spacing="0"
		>
			<Sidebar />

			<HeaderProvider>
				<Box flex="1" w="0">
					<Header />
					<Box as="main">{children}</Box>
				</Box>
			</HeaderProvider>
		</Stack>
	);
}
