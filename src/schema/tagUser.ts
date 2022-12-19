import { Static, Type } from "@sinclair/typebox";

import { UserSchemaWithoutTags } from "./user";
import { TagWithoutUsersSchema } from "./tag";

export type UserSchmaWithoutTagsType = Static<typeof UserSchemaWithoutTags>;

export const UserSchema = Type.Object({
    UserSchemaWithoutTags,
    tags: Type.Optional(Type.Array(TagWithoutUsersSchema)),
});

export type UserType = Static<typeof UserSchema>;

export const TagSchema = Type.Object({
    TagWithoutUsersSchema,
    users: Type.Optional(Type.Array(UserSchemaWithoutTags)),
});

export type TagType = Static<typeof TagSchema>;
