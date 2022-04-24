import { Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
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
		if (status !== "loading" && !isUser) router.replace("/login");
	}, [isUser, status, router]);

	if (isUser) {
		return <>{children}</>;
	}

	return (
		<Center w="full">
			<Spinner size="xl" />
		</Center>
	);
}
