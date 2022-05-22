import type { ComponentStyleConfig, ThemeConfig } from "@chakra-ui/react";
import {
	extendTheme,
	IconButton as IconButtonComponent,
} from "@chakra-ui/react";

const config: ThemeConfig = {
	initialColorMode: "system",
	disableTransitionOnChange: true,
};

const font =
	"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

const Button: ComponentStyleConfig = {
	defaultProps: {
		size: { md: "sm" },
	},
	baseStyle: {
		_focus: { boxShadow: "none" },
		_focusVisible: { boxShadow: "outline" },
	},
};

IconButtonComponent.defaultProps = {
	...IconButtonComponent.defaultProps,
	variant: "unstyled",
};
const IconButton: ComponentStyleConfig = {
	defaultProps: {
		size: { md: "sm" },
	},
};

const Link: ComponentStyleConfig = {
	baseStyle: {
		_focus: { boxShadow: "none" },
		_focusVisible: { boxShadow: "outline" },
	},
};

const Modal: ComponentStyleConfig = {
	baseStyle: {
		dialog: {
			m: "2",
		},
		header: {
			borderBottom: "1px",
			borderColor: "gray.100",
			_dark: { borderColor: "gray.600" },
		},
	},
};

export const theme = extendTheme({
	config,
	fonts: {
		body: font,
		heading: font,
	},
	components: {
		Button,
		IconButton,
		Link,
		Modal,
	},
});
