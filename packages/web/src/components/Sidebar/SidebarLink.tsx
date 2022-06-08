import { chakra, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ComponentType, forwardRef, Fragment, ReactNode } from "react";
import { ChakraNextLink } from "../ChakraNextLink";
import { Tooltip } from "../Tooltip";

interface Props {
	href: string;
	icon?: ComponentType;
	label?: ReactNode;
	hotkey?: string;
	children: string;
}

export const SidebarLink = forwardRef<HTMLAnchorElement, Props>(
	function SidebarLink({ href, icon: Icon, hotkey, label, children }, ref) {
		const router = useRouter();

		const bg = useColorModeValue("gray.100", "gray.700");

		const isActive = router.asPath === href;

		const Wrapper = label
			? ({ children }: { children: ReactNode }) => (
					<Tooltip label={label} placement="right">
						{children}
					</Tooltip>
			  )
			: Fragment;

		return (
			<Wrapper>
				<ChakraNextLink
					href={href}
					w="full"
					display="flex"
					alignItems="center"
					px={2}
					py={0.5}
					borderRadius="md"
					bg={isActive ? bg : undefined}
					_hover={{ bg }}
					data-hotkey={hotkey}
					ref={ref}
				>
					{Icon && (
						<chakra.div marginRight={2} display="inline-block">
							<Icon />
						</chakra.div>
					)}
					{children}
				</ChakraNextLink>
			</Wrapper>
		);
	}
);
