import { literal, ZodString } from "zod";

export function optionalTextInputSchema(schema: ZodString) {
	return schema.optional().or(literal("").transform(() => undefined));
}
