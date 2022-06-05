import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Logo";
import { Textarea } from "@/components/Textarea";
import { FormEvent, useState } from "react";
import { BOOKMARK_PAGE_BASE_URL, READING_LIST_URL } from "../config";
import { Bookmark, deleteBookmark, updateBookmark } from "../mutations";

interface Props {
	bookmark: Bookmark;
}

export function BookmarkSaved({ bookmark }: Props) {
	const [title, setTitle] = useState(bookmark.title);
	const [note, setNote] = useState(bookmark.note ?? "");

	const [deleted, setDeleted] = useState(false);

	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const isProcessing = isSaving || isDeleting;

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		setIsSaving(true);

		await new Promise(r => setTimeout(r, 5000));

		const updated = await updateBookmark({ id: bookmark.id, title, note });
		setTitle(updated.title);
		setNote(updated.note ?? "");

		setIsSaving(false);
	}

	async function handleDelete() {
		setIsDeleting(true);
		await new Promise(r => setTimeout(r, 5000));
		await deleteBookmark(bookmark.id);
		setDeleted(true);
	}

	return (
		<div className="flex-grow flex flex-col gap-2">
			<div className="flex items-center gap-1 text-xl">
				<Logo className="h-[1em] w-[1em] text-sky-600" />{" "}
				<span>{deleted ? "Deleted bookmark" : "Saved to Pockly"}</span>
			</div>

			{!deleted && (
				<>
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
							<Button
								type="submit"
								isLoading={isSaving}
								disabled={isProcessing}
							>
								Update
							</Button>
							<Button
								type="button"
								intent="danger"
								isLoading={isDeleting}
								disabled={isProcessing}
								onClick={handleDelete}
							>
								Delete
							</Button>
						</div>
					</form>
				</>
			)}
		</div>
	);
}
