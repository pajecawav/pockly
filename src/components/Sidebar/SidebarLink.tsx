import { chakra, Link, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ComponentType } from "react";

export function SidebarLink({
	href,
	icon: Icon,
	children,
}: {
	href: string;
	icon?: ComponentType;
	children: string;
}) {
	const router = useRouter();

	const bg = useColorModeValue("gray.100", "gray.700");

	const isActive = router.pathname === href;

	return (
		<NextLink href={href} passHref>
			<Link
				w="full"
				display="flex"
				alignItems="center"
				px={2}
				py={0.5}
				borderRadius="md"
				bg={isActive ? bg : undefined}
				_hover={{ bg }}
			>
				<chakra.div w={3.5} marginRight={2} display="inline-block">
					{Icon && <Icon />}
				</chakra.div>
				{children}
			</Link>
		</NextLink>
	);
}
