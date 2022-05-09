import { chakra, Link, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ComponentType, Fragment, ReactNode } from "react";
import { Tooltip } from "../Tooltip";

interface Props {
	href: string;
	icon?: ComponentType;
	label?: ReactNode;
	hotkey?: string;
	children: string;
}

export function SidebarLink({
	href,
	icon: Icon,
	hotkey,
	label,
	children,
}: Props) {
	const router = useRouter();

	const bg = useColorModeValue("gray.100", "gray.700");

	const isActive = router.asPath === href;

	// TODO: memoize wrapper?
	const Wrapper = label
		? ({ children }: { children: ReactNode }) => (
				<Tooltip label={label} placement="right" shouldWrapChildren>
					{children}
				</Tooltip>
		  )
		: Fragment;

	return (
		<Wrapper>
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
					data-hotkey={hotkey}
				>
					{Icon && (
						<chakra.div
							w={3.5}
							marginRight={2}
							display="inline-block"
						>
							<Icon />
						</chakra.div>
					)}
					{children}
				</Link>
			</NextLink>
		</Wrapper>
	);
}
