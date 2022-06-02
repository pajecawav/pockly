import { StrictTypedTypePolicies } from "@/__generated__/apollo-helpers";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

const typePolicies: StrictTypedTypePolicies = {
	Query: {
		fields: {
			bookmarks: relayStylePagination([
				"filter",
				"sort",
				"oldestFirst",
				"tag",
			]),
			tags: {
				// always overwrite cached tags with new ones
				merge(_existing, incoming: any[]) {
					return incoming;
				},
			},
		},
	},
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
};

const cache = new InMemoryCache({
	typePolicies,
});

export const client = new ApolloClient({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
	cache,
	credentials: "same-origin",
	connectToDevTools: process.env.NODE_ENV === "development",
});
