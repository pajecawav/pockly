import { RefObject, useCallback, useEffect, useRef } from "react";

enum FocusDirection {
	Next,
	Prev,
}

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

export function useListFocusHotkeys({ ref }: { ref: RefObject<HTMLElement> }) {
	const lastFocusedIndexRef = useRef<number | null>(null);

	const moveFocus = useCallback(
		(direction: FocusDirection) => {
			if (!ref.current) {
				return;
			}

			const allItems = getAllItems(ref.current);
			if (allItems.length === 0) {
				return;
			}

			const currentIndex = lastFocusedIndexRef.current ?? -1;

			let nextIndex: number;
			if (currentIndex === -1) {
				nextIndex = 0;
			} else if (!ref.current.contains(document.activeElement)) {
				nextIndex = currentIndex;
			} else if (direction === FocusDirection.Next) {
				nextIndex = currentIndex + 1;
			} else {
				nextIndex = currentIndex - 1;
			}
			nextIndex = Math.max(0, Math.min(allItems.length - 1, nextIndex));

			const nextItem = allItems[nextIndex];
			if (nextItem) {
				focusListItem(nextItem);
				lastFocusedIndexRef.current = nextIndex;
			}
		},
		[ref]
	);

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

			const direction =
				event.key === "j" ? FocusDirection.Next : FocusDirection.Prev;
			moveFocus(direction);
		}

		document.body.addEventListener("keydown", handler);
		return () => document.body.removeEventListener("keydown", handler);
	}, [ref, moveFocus]);

	const reset = useCallback(() => {
		lastFocusedIndexRef.current = null;
	}, []);

	const focusNextItem = useCallback(() => {
		moveFocus(FocusDirection.Next);
	}, [moveFocus]);

	const focusPrevItem = useCallback(() => {
		moveFocus(FocusDirection.Prev);
	}, [moveFocus]);

	return { reset, focusNextItem, focusPrevItem };
}
