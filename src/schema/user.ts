import { Static, Type } from "@sinclair/typebox";
import { TagWithoutUsersSchema } from "./tag";

export const LDAPUserSchema = Type.Object({
    username: Type.String(),
    password: Type.String(),
});

export type LDAPUserType = Static<typeof LDAPUserSchema>;

export const UserSchemaWithoutTags = Type.Object({
    id: Type.Optional(Type.Integer()),
    username: Type.String(),
});

export const UserResposeSchema = Type.Object({
    user: Type.Union([UserSchemaWithoutTags, Type.Null()]),
    valid: Type.Boolean(),
});

export type UserResposeType = Static<typeof UserResposeSchema>;

export const UserParamsSchema = Type.Object({
    id: Type.Integer(),
});

export type UserParamsType = Static<typeof UserParamsSchema>;

export const UserParamsWithTagIdSchema = Type.Intersect([
    UserParamsSchema,
    Type.Object({
        tid: Type.Integer(),
    }),
]);

export type UserParamsWithTagIdType = Static<typeof UserParamsWithTagIdSchema>;

export const UserBodySchema = Type.Object({
    value: Type.Array(UserParamsSchema),
});

export type UserBodyType = Static<typeof UserBodySchema>;

export const UserTagsSchema = Type.Union([
    Type.Object({
        tags: Type.Array(TagWithoutUsersSchema),
    }),
    Type.Null(),
]);

export type UserTagsType = Static<typeof UserTagsSchema>;

export const UsersAndTagsSchema = Type.Union([
    Type.Object({
        users: Type.Array(
            Type.Intersect([
                Type.Object({ tags: Type.Optional(Type.Array(TagWithoutUsersSchema)) }),
                UserSchemaWithoutTags,
            ]),
        ),
    }),
    Type.Null(),
]);

export type UsersAndTagsType = Static<typeof UsersAndTagsSchema>;
