import { Center, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

interface Props {
	children: ReactNode;
}

export function Auth({ children }: Props) {
	const router = useRouter();
	const { data: session, status } = useSession();

	const isUser = !!session?.user;

	useEffect(() => {
		if (status !== "loading" && !isUser) {
			router.replace({
				pathname: "/auth/login",
				query: { next: window.location.pathname },
			});
		}
	}, [isUser, status, router]);

	if (isUser) {
		return <>{children}</>;
	}

	return (
		<Center w="full">
			<Spinner size="lg" />
		</Center>
	);
}
