import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Logo";
import { Textarea } from "@/components/Textarea";
import { cn } from "@/utils";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BOOKMARK_PAGE_BASE_URL, READING_LIST_URL } from "../config";
import { Bookmark, deleteBookmark, updateBookmark } from "../mutations";

interface Props {
	bookmark: Bookmark;
}

export function BookmarkSaved({ bookmark }: Props) {
	const [title, setTitle] = useState(bookmark.title);
	const [note, setNote] = useState(bookmark.note ?? "");

	const [deleted, setDeleted] = useState(false);

	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const isProcessing = isUpdating || isDeleting;

	// hack to avoid using dependencies in useEffect
	const submitButtonRef = useRef<HTMLButtonElement | null>(null);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		setIsUpdating(true);

		const updated = await updateBookmark({ id: bookmark.id, title, note });
		setTitle(updated.title);
		setNote(updated.note ?? "");

		setIsUpdating(false);
	}

	useEffect(() => {
		if (deleted) return;

		function handler(event: KeyboardEvent) {
			if (event.ctrlKey && event.key === "s") {
				event.preventDefault();
				submitButtonRef.current?.click();
			}
		}

		document.body.addEventListener("keydown", handler);
		() => document.body.removeEventListener("keydown", handler);
	}, [deleted]);

	async function handleDelete() {
		setIsDeleting(true);
		await deleteBookmark(bookmark.id);
		setDeleted(true);
	}

	const headerText = deleted
		? "Deleted Bookmark"
		: isUpdating
		? "Updating Bookmark..."
		: isDeleting
		? "Deleting Bookmark..."
		: "Saved Bookmark";

	return (
		<div className="flex-grow flex flex-col">
			<div className="flex items-center gap-1 text-xl">
				<Logo className="h-[1em] w-[1em] text-sky-600" />{" "}
				<span>{headerText}</span>
			</div>

			<div
				className={cn(
					"flex-grow flex flex-col gap-2 transition-opacity duration-500",
					deleted && "opacity-0 pointer-events-none"
				)}
				aria-hidden={deleted}
			>
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
							isLoading={isUpdating}
							disabled={isProcessing}
							ref={submitButtonRef}
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
			</div>
		</div>
	);
}
