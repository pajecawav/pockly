import { createContext, Key, ReactNode, useContext, useState } from "react";
import ReactDOM from "react-dom";

type HeaderContextValue = [
	HTMLElement | null,
	(ref: HTMLElement | null) => void
];

export const HeaderContext = createContext(null as any as HeaderContextValue);

export const HeaderProvider = (props: {
	children?: ReactNode;
	key?: Key | null | undefined;
}) => {
	const headerState = useState(null);
	return (
		<HeaderContext.Provider
			value={headerState as HeaderContextValue}
			{...props}
		/>
	);
};

export function HeaderPortal({ children }: { children: ReactNode }) {
	const [header] = useContext(HeaderContext);
	return header ? ReactDOM.createPortal(children, header) : null;
}
