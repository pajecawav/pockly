import { RefObject, useCallback, useEffect, useRef } from "react";

export function useListFocusHotkeys<T extends HTMLElement>({
	ref,
}: {
	ref: RefObject<T>;
}) {
	const lastFocusedItemRef = useRef<T | null>(null);

	useEffect(() => {
		function handler(event: KeyboardEvent) {
			if (!ref.current) {
				return;
			}

			const target = event.target as HTMLElement;
			if (
				["input", "textarea", "select"].includes(
					target.tagName.toLowerCase()
				) ||
				target.isContentEditable
			) {
				return;
			}

			function focusItem(item: HTMLElement) {
				const itemTarget = item.querySelector<HTMLElement>(
					"[data-focus-list-target]"
				);
				if (itemTarget) {
					itemTarget.focus();
					itemTarget.scrollIntoView({ block: "center" });
				}
			}

			if (event.key !== "j" && event.key !== "k") {
				return;
			}
			const selectNext = event.key === "j";

			const allItems = Array.from(
				ref.current.querySelectorAll<HTMLElement>(
					"[data-focus-list-item]"
				)
			);

			let nextIndex;
			if (ref.current.contains(target)) {
				const currentItem = target.closest<HTMLElement>(
					"[data-focus-list-item]"
				);
				const index = allItems.findIndex(item => item === currentItem);
				nextIndex = selectNext
					? Math.min(index + 1, allItems.length - 1)
					: Math.max(index - 1, 0);
			} else if (lastFocusedItemRef.current) {
				nextIndex = allItems.findIndex(
					item => item === lastFocusedItemRef.current
				);
			} else {
				nextIndex = 0;
			}

			const nextItem = allItems[nextIndex];
			if (nextItem) {
				focusItem(nextItem);
				lastFocusedItemRef.current = nextItem as T;
			}
		}

		document.body.addEventListener("keypress", handler);
		return () => document.body.removeEventListener("keypress", handler);
	}, [ref]);

	const reset = useCallback(() => {
		lastFocusedItemRef.current = null;
	}, []);

	return { reset };
}
