import { Static, Type } from "@sinclair/typebox";
import { TagWithoutUsersSchema } from "./tag";

export const LDAPUserSchema = Type.Object({
    username: Type.String(),
    password: Type.String(),
});

export type LDAPUserType = Static<typeof LDAPUserSchema>;

export const UserSchemaWithoutTags = Type.Object({
    id: Type.Optional(Type.String()),
    username: Type.String(),
});

export const UserResposeSchema = Type.Object({
    user: Type.Union([UserSchemaWithoutTags, Type.Null()]),
    valid: Type.Boolean(),
});

export type UserResposeType = Static<typeof UserResposeSchema>;

//Dieses Schema wird für Params verwendet, wo die id vom User notwendig ist
export const UserParamsSchema = Type.Object({
    id: Type.String(),
});

export type UserParamsType = Static<typeof UserParamsSchema>;

export const UserParamsWithTagIdSchema = Type.Object({
    id: Type.String(),
    tid: Type.String(),
});

export type UserParamsWithTagIdType = Static<typeof UserParamsWithTagIdSchema>;

//Dieses Schema wird verwendet um die ID von einem Tag darzustellen
export const UserValueSchema = Type.Object({
    id: Type.String(),
});

//Wird verwendet um den body vom request als Array darzustellen
export const UserBodySchema = Type.Object({
    value: Type.Array(UserValueSchema),
});

export type UserBodyType = Static<typeof UserBodySchema>;

export const TagSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Union([Type.String(), Type.Date()])),
    updatedAt: Type.Optional(Type.Union([Type.String(), Type.Date()])),
    value: Type.String(),
});

export const UserTagsSchema = Type.Union([
    Type.Object({
        tags: Type.Array(TagSchema),
    }),
    Type.Null(),
]);

export type UserTagsType = Static<typeof UserTagsSchema>;

export const UserAndTagsSchema = Type.Union([
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

export type UserAndTagType = Static<typeof UserAndTagsSchema>;
