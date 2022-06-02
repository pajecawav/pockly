import { db } from "./client";
import faker from "@faker-js/faker";

// faker.seed(123);

async function main() {
	const user = await db.user.findFirst();

	if (!user) {
		throw new Error("You have to create a user before seeding database");
	}

	await db.bookmark.createMany({
		data: Array.from({ length: 40 }, () => ({
			userId: user.id,
			url: faker.internet.url(),
			title: faker.lorem.sentence(),
		})),
	});
}

main()
	.catch(error => {
		console.error(error);
		throw error;
	})
	.finally(() => db.$disconnect());
