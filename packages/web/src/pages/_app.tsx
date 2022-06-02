import { Auth } from "@/components/Auth";
import { DefaultAppShell } from "@/components/DefaultAppShell";
import { DynamicHead } from "@/components/DynamicHead";
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
		<>
			<Head>
				<title>pockly</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
			</Head>
			<ChakraProvider resetCSS={true} theme={theme}>
				<SessionProvider session={session} refetchOnWindowFocus={false}>
					<ApolloProvider client={client}>
						<NProgress />

						<DynamicHead />

						<Wrapper>
							<AppShell>
								<Component {...pageProps} />
							</AppShell>
						</Wrapper>
					</ApolloProvider>
				</SessionProvider>
			</ChakraProvider>
		</>
	);
}
