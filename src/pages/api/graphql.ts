import { db } from "prisma/client";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-micro";
import { NextApiHandler, NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import { schema } from "@/graphql/schema";

const server = new ApolloServer({
	schema,
	plugins: [
		ApolloServerPluginLandingPageGraphQLPlayground({
			settings: { "request.credentials": "include" },
		}),
	],
	context: async ({ req }: { req: NextApiRequest }) => {
		const session = await getSession({ req });
		const id = session?.user?.id;

		const user = id ? await db.user.findUnique({ where: { id } }) : null;

		return { user };
	},
});

const startServer = server.start();

export const config = {
	api: {
		bodyParser: false,
	},
};

const handler: NextApiHandler = async (req, res) => {
	await startServer;
	await server.createHandler({
		path: "/api/graphql",
	})(req, res);
};

export default handler;
