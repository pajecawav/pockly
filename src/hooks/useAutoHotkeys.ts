import { RefObject, useEffect, useRef } from "react";

interface UseAutoHotkeysArgs {
	ref: RefObject<HTMLElement> | HTMLElement;
	scopeRef?: RefObject<HTMLElement> | HTMLElement;
	options?: boolean | AddEventListenerOptions;
}

export function useAutoHotkeys({ ref, scopeRef, options }: UseAutoHotkeysArgs) {
	const previousKey = useRef<string | null>(null);
	const resetPreviousKeyTimeoutId = useRef<number | undefined>(undefined);

	useEffect(() => {
		function unref(
			ref: RefObject<HTMLElement> | HTMLElement
		): HTMLElement | null {
			return ref instanceof HTMLElement ? ref : ref.current;
		}

		const element = unref(ref);
		const scopeElement = scopeRef ? unref(scopeRef) : null;
		if (!element) {
			return;
		}

		function handler(event: KeyboardEvent) {
			const target = event.target as HTMLElement;
			if (
				["input", "textarea", "select"].includes(
					target.tagName.toLowerCase()
				) ||
				target.isContentEditable
			) {
				return;
			}

			clearTimeout(resetPreviousKeyTimeoutId.current);

			function getElementForHotkey(hotkey: string) {
				return (scopeElement || element)?.querySelector<HTMLElement>(
					`[data-hotkey="${hotkey}"]`
				);
			}

			function handleHotkey(hotkey: string): boolean {
				const target = getElementForHotkey(hotkey);
				if (target) {
					target.click();
					return true;
				}
				return false;
			}

			function resetPreviousKey() {
				previousKey.current = null;
			}

			function updatePreviousKey() {
				previousKey.current = event.key;
				resetPreviousKeyTimeoutId.current = window.setTimeout(
					resetPreviousKey,
					250
				);
			}

			if (handleHotkey(event.key)) {
				event.stopPropagation();
				event.preventDefault();
				resetPreviousKey();
				return;
			}

			if (!previousKey.current) {
				updatePreviousKey();
				return;
			}

			const success = handleHotkey(`${previousKey.current} ${event.key}`);
			if (success) {
				event.stopPropagation();
				resetPreviousKey();
				return;
			} else {
				updatePreviousKey();
			}
		}

		element.addEventListener("keydown", handler, options);
		return () => element.removeEventListener("keydown", handler, options);
	}, [ref, scopeRef, options]);
}
