import { Center, Spinner } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

export default function IndexPage() {
	return (
		<Center>
			<Spinner />
		</Center>
	);
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getSession({ req: ctx.req });

	return {
		redirect: {
			destination: session?.user ? "/read" : "/login",
		},
		props: {},
	};
};
