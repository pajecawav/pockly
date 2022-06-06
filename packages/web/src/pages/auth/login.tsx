import { GitHubIcon } from "@/components/icons/GithubIcon";
import { Center } from "@chakra-ui/layout";
import { Button, Icon } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { Fragment } from "react";

export default function LoginPage() {
	const router = useRouter();
	const next = router.query.next as string | undefined;

	return (
		<Center w="full" minH="full" p={1}>
			<Button
				size="lg"
				leftIcon={<Icon as={GitHubIcon} />}
				onClick={() => signIn("github", { callbackUrl: next })}
			>
				Sign in with GitHub
			</Button>
		</Center>
	);
}

LoginPage.AppShell = Fragment;
LoginPage.public = true;

const isAbsoluteUrlRegex = new RegExp("^(?:[a-z]+:)?//", "i");

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req });
	if (!session?.user || !req.url) {
		return { props: {} };
	}

	const requestUrl = new URL(req.url, process.env.BASE_URL);
	const nextParam = requestUrl.searchParams.get("next");

	let next: string | undefined;
	if (nextParam && !isAbsoluteUrlRegex.test(nextParam)) {
		next = nextParam;
	}

	return {
		redirect: {
			permanent: false,
			destination: next ?? "/read",
		},
		props: {},
	};
};
