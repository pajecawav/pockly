import { User } from "@prisma/client";

export type Scalars = {
	DateTime: {
		Input: Date;
		Output: Date;
	};
};

export type Context = {
	user: User | null;
};

export type AuthScopes = {
	user: boolean;
};
