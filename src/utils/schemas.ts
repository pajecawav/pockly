import { z, ZodString } from "zod";

export function optionalTextInputSchema(schema: ZodString) {
	return schema.optional().or(z.literal("").transform(() => undefined));
}
