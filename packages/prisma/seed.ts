import { db } from "./client";
import { faker } from "@faker-js/faker";

// faker.seed(123);

async function main() {
	const user = await db.user.findFirst();

	if (!user) {
		throw new Error("You have to create a user before seeding database");
	}

	// random bookmarks
	await db.bookmark.createMany({
		data: Array.from({ length: 40 }, () => ({
			userId: user.id,
			url: faker.internet.url(),
			title: faker.lorem.sentence(),
		})),
	});

	const predefinedBookmarks: {
		url: string;
		title: string;
		tags?: string[];
	}[] = [
		{
			url: "https://www.youtube.com",
			title: "YouTube",
			tags: ["youtube", "foo"],
		},
		{
			url: "https://www.notion.so",
			title: "Notion – One workspace. Every team.",
			tags: ["notion", "bar"],
		},
		{
			url: "https://linear.app",
			title: "Linear – The issue tracking tool you’ll enjoy using.",
			tags: ["foo", "linear"],
		},
		{
			url: "https://www.prisma.io",
			title: "Prisma - Next-generation Node.js and TypeScript ORM for Databases",
			tags: ["bar", "prisma"],
		},
		{
			url: "https://google.com",
			title: "Google",
			tags: ["bar", "foo", "google"],
		},
	];

	// pre-defined bookmarks
	for (const bookmark of predefinedBookmarks) {
		await db.bookmark.create({
			data: {
				userId: user.id,
				url: bookmark.url,
				title: bookmark.title,
				tags: {
					connectOrCreate: bookmark.tags?.map(tag => ({
						create: {
							name: tag,
							userId: user.id,
						},
						where: {
							name_userId: { name: tag, userId: user.id },
						},
					})),
				},
			},
		});
	}
}

main()
	.catch(error => {
		console.error(error);
		throw error;
	})
	.finally(() => db.$disconnect());
