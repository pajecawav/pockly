import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache({
	typePolicies: {
		Bookmark: {
			fields: {
				tags: {
					// always overwrite cached tags with new ones
					merge(_existing, incoming: any[]) {
						return incoming;
					},
				},
			},
		},
	},
});

export const client = new ApolloClient({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
	cache,
	credentials: "same-origin",
	connectToDevTools: process.env.NODE_ENV === "development",
});
