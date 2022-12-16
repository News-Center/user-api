import { Static, Type } from "@sinclair/typebox";

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
