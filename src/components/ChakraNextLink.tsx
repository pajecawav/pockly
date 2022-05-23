import { Link, LinkProps } from "@chakra-ui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef } from "react";

export interface ChakraNextLinkProps extends Omit<LinkProps, "href"> {
	href: NextLinkProps["href"];
}

export const ChakraNextLink = forwardRef<
	HTMLAnchorElement,
	ChakraNextLinkProps
>(function ChakraNextLink({ href, ...props }, ref) {
	return (
		<NextLink href={href} passHref>
			<Link {...props} ref={ref} />
		</NextLink>
	);
});
