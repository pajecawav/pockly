import { db } from "@pockly/prisma";
import axios from "axios";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { supabase } from "./supabase/client";
import { uploadFile } from "./supabase/storage";

const THUMBNAIL_WIDTH = 600;
const THUMBNAIL_HEIGHT = 400;

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "pockly";

export async function getThumbnailImage(imageUrl: string): Promise<string> {
	if (!supabase) {
		return imageUrl;
	}

	// check if thumbnail was processed before
	const thumbnail = await db.thumbnail.findFirst({
		where: {
			sourceUrl: imageUrl,
		},
	});

	console.log({ thumbnail });
	if (thumbnail) {
		return thumbnail.url;
	}

	try {
		const image = await processImage(imageUrl);
		const { id, url } = await uploadThumbnail(image);

		await db.thumbnail.create({
			data: {
				id,
				url,
				sourceUrl: imageUrl,
			},
		});

		return url;
	} catch (e) {
		console.error(e);
		return imageUrl;
	}
}

async function processImage(imageUrl: string): Promise<Buffer> {
	const response = await axios.get(imageUrl, {
		responseType: "arraybuffer",
	});

	// TODO: adjust options
	const image = await sharp(response.data)
		.resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: "cover" })
		.toBuffer();

	return image;
}

async function uploadThumbnail(
	image: Buffer
): Promise<{ id: string; url: string }> {
	const id = uuid();
	const path = `thumbnails/${id}`;

	const url = await uploadFile(path, image);

	return { id, url };
}
