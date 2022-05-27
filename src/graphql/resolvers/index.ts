import { builder } from "../builder";

import "./bookmarsResolver";
import "./tagsResolver";
import "./usersResolver";

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
