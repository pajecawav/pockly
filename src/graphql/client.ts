import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
	cache: new InMemoryCache(),
	credentials: "same-origin",
	connectToDevTools: process.env.NODE_ENV === "development",
});
