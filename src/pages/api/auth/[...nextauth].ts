import { db } from "prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
	secret: process.env.NEXTAUTH_SECRET,
	adapter: PrismaAdapter(db),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
	],
	theme: {
		colorScheme: "auto",
	},
	pages: {
		signIn: "/auth/login",
	},
	callbacks: {
		session: ({ session, user }) => {
			session.user.id = user.id;
			return session;
		},
	},
});
