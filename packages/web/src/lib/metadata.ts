import axios from "axios";
import Metascraper from "metascraper";
import MetascraperImage from "metascraper-image";
import MetascraperTitle from "metascraper-title";

const metascraper = Metascraper([MetascraperTitle(), MetascraperImage()]);

interface PageMetadata {
	title?: string | null;
	image?: string | null;
}

export async function getPageMetadata(url: string): Promise<PageMetadata> {
	// TODO: handle errors
	const response = await axios.get(url);
	const { title, image } = await metascraper({ html: response.data, url });
	return { title, image };
}
