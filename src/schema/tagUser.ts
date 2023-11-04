import { Static, Type } from "@sinclair/typebox";

import { UserSchemaWithoutTags } from "./user";
import { TagWithoutUsersSchema } from "./tag";
import { PhaseSchema } from "./phase";

export type UserSchemaWithoutTagsType = Static<typeof UserSchemaWithoutTags>;

export const UserSchema = Type.Union([
    Type.Intersect([Type.Object({ tags: Type.Optional(Type.Array(TagWithoutUsersSchema)) }), UserSchemaWithoutTags]),
    Type.Null(),
]);

export type UserType = Static<typeof UserSchema>;

export const UserWithPhasesSchema = Type.Union([
    Type.Intersect([Type.Object({ phases: Type.Optional(Type.Array(PhaseSchema)) }), UserSchemaWithoutTags]),
    Type.Null(),
]);

export type UserWithPhasesType = Static<typeof UserWithPhasesSchema>;

export const TagSchema = Type.Object({
    TagWithoutUsersSchema,
    users: Type.Optional(Type.Array(UserSchemaWithoutTags)),
});

export type TagType = Static<typeof TagSchema>;
