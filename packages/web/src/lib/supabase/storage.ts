import { supabase } from "./client";

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "pockly";

export async function uploadFile(path: string, file: Buffer): Promise<string> {
	if (!supabase) {
		throw new Error("Supabase isn't initialized");
	}

	// TODO: add `cache-control` param to upload
	const { data, error } = await supabase.storage
		.from(BUCKET_NAME)
		.upload(path, file);

	if (!data || error) {
		throw error ?? new Error("Failed to upload file to bucket");
	}

	return `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.Key}`;
}
