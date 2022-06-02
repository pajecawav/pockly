import { builder } from "../builder";

import "./bookmarksResolver";
import "./tagsResolver";
import "./usersResolver";

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
