import create from "zustand";
import { persist } from "zustand/middleware";

type Store = {
	tags: string[];
	pinTag: (tag: string) => void;
	unpinTag: (tag: string) => void;
	isTagPinned: (tag: string) => boolean;
};

export const usePinnedTagsStore = create<Store>()(
	persist(
		(set, get) => ({
			tags: [],
			pinTag: (tag: string) => {
				tag = tag.toLocaleLowerCase();
				const tags = get().tags;
				if (!tags.includes(tag)) {
					set({ tags: [...tags, tag] });
				}
			},
			unpinTag: (tag: string) =>
				set({
					tags: get().tags.filter(t => t !== tag.toLocaleLowerCase()),
				}),
			isTagPinned: (tag: string) =>
				get().tags.includes(tag.toLocaleLowerCase()),
		}),
		{ name: "pockly.pinned_tags" }
	)
);
