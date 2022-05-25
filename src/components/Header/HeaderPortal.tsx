import {
	createContext,
	forwardRef,
	Key,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
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

interface HeaderPortalProps {
	children: ReactNode;
}

export const HeaderPortal = forwardRef<HTMLElement, HeaderPortalProps>(
	function HeaderPortal({ children }, ref) {
		const [header] = useContext(HeaderContext);

		useEffect(() => {
			// TODO: not sure if this is the correct way to implement ref
			// handling but it works
			if (typeof ref === "function") {
				ref(header);
				return () => ref(null);
			} else if (ref) {
				ref.current = header;
				return () => (ref.current = null);
			}
		}, [header, ref]);

		return header ? ReactDOM.createPortal(children, header) : null;
	}
);
