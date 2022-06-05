import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Logo";
import { Textarea } from "@/components/Textarea";
import { FormEvent, useState } from "react";
import { BOOKMARK_PAGE_BASE_URL, READING_LIST_URL } from "../config";
import { Bookmark, updateBookmark } from "../mutations";

interface Props {
	bookmark: Bookmark;
}

export function BookmarkSaved({ bookmark }: Props) {
	const [title, setTitle] = useState(bookmark.title);
	const [note, setNote] = useState(bookmark.note ?? "");
	const [isSaving, setIsSaving] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		setIsSaving(true);

		const updated = await updateBookmark({ id: bookmark.id, title, note });
		setTitle(updated.title);
		setNote(updated.note ?? "");

		setIsSaving(false);
	}

	return (
		<div className="h-full flex flex-col gap-2">
			<div>
				<div className="text-xl">
					<Logo className="inline h-[1em] w-[1em] text-sky-600" />{" "}
					Saved to Pockly
				</div>
				<div className="text-sm">
					<a
						className="text-blue-500 hover:underline"
						href={READING_LIST_URL}
					>
						Reading List
					</a>
					<span className="text-black"> | </span>
					<a
						className="text-blue-500 hover:underline"
						href={`${BOOKMARK_PAGE_BASE_URL}/${bookmark.id}`}
					>
						Bookmark Page
					</a>
				</div>
			</div>

			<form
				className="flex-grow flex flex-col gap-2"
				onSubmit={handleSubmit}
			>
				<Input
					placeholder="Title"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>

				<Textarea
					className="resize-none flex-grow"
					placeholder="Write your notes here"
					value={note}
					onChange={e => setNote(e.target.value)}
				/>

				<div className="self-center flex gap-2">
					<Button type="submit" isLoading={isSaving}>
						Update
					</Button>
				</div>
			</form>
		</div>
	);
}
