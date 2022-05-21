import { RefObject, useEffect, useRef } from "react";

const HOTKEY_SEQUENCE_TIMEOUT = 250;

interface UseAutoHotkeysArgs {
	ref: RefObject<HTMLElement> | HTMLElement;
	scopeRef?: RefObject<HTMLElement> | HTMLElement;
	options?: boolean | AddEventListenerOptions;
}

function getHotkey(event: KeyboardEvent): string {
	let hotkey = "";

	// modifiers
	if (event.ctrlKey) hotkey += "ctrl+";
	if (event.altKey) hotkey += "alt+";

	// key
	if (!["Control", "Alt"].includes(event.key)) {
		hotkey += event.key;
	}

	if (hotkey.endsWith("+")) {
		hotkey = hotkey.slice(0, -1);
	}

	return hotkey;
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

			function updatePreviousKey(key: string) {
				previousKey.current = key;
				resetPreviousKeyTimeoutId.current = window.setTimeout(
					resetPreviousKey,
					HOTKEY_SEQUENCE_TIMEOUT
				);
			}

			const hotkey = getHotkey(event);

			if (handleHotkey(hotkey)) {
				event.stopPropagation();
				event.preventDefault();
				resetPreviousKey();
				return;
			}

			if (!previousKey.current) {
				updatePreviousKey(hotkey);
				return;
			}

			const success = handleHotkey(`${previousKey.current} ${hotkey}`);
			if (success) {
				event.stopPropagation();
				resetPreviousKey();
				return;
			} else {
				updatePreviousKey(hotkey);
			}
		}

		element.addEventListener("keydown", handler, options);
		return () => element.removeEventListener("keydown", handler, options);
	}, [ref, scopeRef, options]);
}
