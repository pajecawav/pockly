import { RefObject, useCallback, useEffect, useRef } from "react";

function shouldIgnoreEventTarget(target: HTMLElement): boolean {
	return (
		["input", "textarea", "select"].includes(
			target.tagName.toLowerCase()
		) || target.isContentEditable
	);
}

function focusListItem(item: HTMLElement) {
	const itemTarget = item.querySelector<HTMLElement>(
		"[data-focus-list-target]"
	);
	if (itemTarget) {
		itemTarget.focus();
		itemTarget.scrollIntoView({ block: "center" });
	}
}

function getAllItems(list: HTMLElement): HTMLElement[] {
	return Array.from(
		list.querySelectorAll<HTMLElement>("[data-focus-list-item]")
	);
}

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
			if (shouldIgnoreEventTarget(target)) {
				return;
			}

			if (event.key !== "j" && event.key !== "k") {
				return;
			}
			const selectNext = event.key === "j";

			const allItems = getAllItems(ref.current);
			if (allItems.length === 0) {
				return;
			}

			// refocus last focused element
			if (
				lastFocusedItemRef.current &&
				!lastFocusedItemRef.current.contains(document.activeElement)
			) {
				focusListItem(lastFocusedItemRef.current);
				return;
			}

			const currentItem = target.closest<HTMLElement>(
				"[data-focus-list-item]"
			);
			const currentIndex = allItems.findIndex(
				item => item === currentItem
			);

			let nextIndex: number;
			if (currentIndex === -1) {
				nextIndex = 0;
			} else if (selectNext) {
				nextIndex = Math.min(currentIndex + 1, allItems.length - 1);
			} else {
				nextIndex = Math.max(currentIndex - 1, 0);
			}

			const nextItem = allItems[nextIndex];
			if (nextItem) {
				focusListItem(nextItem);
				lastFocusedItemRef.current = nextItem as T;
			}
		}

		document.body.addEventListener("keydown", handler);
		return () => document.body.removeEventListener("keydown", handler);
	}, [ref]);

	const reset = useCallback(() => {
		lastFocusedItemRef.current = null;
	}, []);

	return { reset };
}
