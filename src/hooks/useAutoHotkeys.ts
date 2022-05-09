import { RefObject, useEffect } from "react";

export function useAutoHotkeys(ref: RefObject<HTMLElement>) {
	useEffect(() => {
		if (!ref.current) {
			return;
		}

		function handler(event: KeyboardEvent) {
			const target = ref.current?.querySelector<HTMLElement>(
				`[data-hotkey="${event.key}"]`
			);
			target?.click();
		}

		ref.current.addEventListener("keypress", handler);
		const { current } = ref;
		return () => current?.removeEventListener("keypress", handler);
	}, [ref]);
}
