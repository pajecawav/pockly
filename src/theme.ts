import type { ComponentStyleConfig, ThemeConfig } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import {
	IconButton as IconButtonComponent,
	Icon as IconComponent,
} from "@chakra-ui/react";

/** @type {import("@chakra-ui/react").ThemeConfig} */
const config: ThemeConfig = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

const font =
	"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

const Button: ComponentStyleConfig = {
	defaultProps: {
		size: { md: "sm" },
	},
};

// HACK: defaultProps doesn't work for some reason
IconButtonComponent.defaultProps = {
	...IconButtonComponent.defaultProps,
	variant: "unstyled",
};
const IconButton: ComponentStyleConfig = {
	defaultProps: {
		size: { md: "sm" },
	},
};

// HACK: defaultProps doesn't work for some reason
IconComponent.defaultProps = {
	...IconComponent.defaultProps,
	strokeWidth: "1.5",
};
const Icon: ComponentStyleConfig = {};

const Modal: ComponentStyleConfig = {
	baseStyle: {
		dialog: {
			m: "2",
		},
		header: {
			borderBottom: "1px",
			borderColor: "gray.100",
			_dark: { borderColor: "gray.700" },
		},
	},
};

export const theme = extendTheme({
	config,
	fonts: {
		body: font,
		heading: font,
	},
	styles: {
		global: (props: any) => ({
			body: {
				bg: mode("white", "gray.800")(props),
			},
		}),
	},
	components: {
		Button,
		IconButton,
		Icon,
		Modal,
	},
});
