import { useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";

export function DynamicHead() {
	return (
		<Head>
			<meta
				name="theme-color"
				content={useColorModeValue("white", "#1A202C")}
			/>
		</Head>
	);
}
