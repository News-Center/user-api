import { Static, Type } from "@sinclair/typebox";

export const TagWithoutUsersSchema = Type.Object({
    id: Type.Optional(Type.Integer()),
    createdAt: Type.Optional(Type.Union([Type.String(), Type.Date()])),
    updatedAt: Type.Optional(Type.Union([Type.String(), Type.Date()])),
    value: Type.String(),
});

export type TagWithoutUsersType = Static<typeof TagWithoutUsersSchema>;

export const TagsResponseSchema = Type.Object({
    tags: Type.Union([Type.Array(TagWithoutUsersSchema), Type.Null()]),
});

export type TagsResponseType = Static<typeof TagsResponseSchema>;

export const TagResponseSchema = Type.Object({
    tag: Type.Union([TagWithoutUsersSchema, Type.Null()]),
});

export type TagResponseType = Static<typeof TagResponseSchema>;

export const TagParamsSchema = Type.Object({
    id: Type.Integer(),
});

export type TagParamsType = Static<typeof TagParamsSchema>;

export const TagBodySchema = Type.Object({
    value: Type.String(),
});

export type TagBodyType = Static<typeof TagBodySchema>;
