import { Auth } from "@/components/Auth";
import { DefaultAppShell } from "@/components/DefaultAppShell";
import { NProgress } from "@/components/NProgress";
import { client } from "@/graphql/client";
import "@/styles/globals.css";
import { theme } from "@/theme";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { Fragment } from "react";

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	const AppShell = (Component as any).AppShell || DefaultAppShell;
	const Wrapper = (Component as any).public ? Fragment : Auth;

	return (
		<ChakraProvider resetCSS={true} theme={theme}>
			<SessionProvider session={session}>
				<ApolloProvider client={client}>
					<Head>
						<title>pockly</title>
					</Head>

					<NProgress />

					<Wrapper>
						<AppShell>
							<Component {...pageProps} />
						</AppShell>
					</Wrapper>
				</ApolloProvider>
			</SessionProvider>
		</ChakraProvider>
	);
}
