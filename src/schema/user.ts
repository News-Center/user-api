import { Static, Type } from "@sinclair/typebox";

export const LDAPUserSchema = Type.Object({
    username: Type.String(),
    password: Type.String(),
});

export type LDAPUserType = Static<typeof LDAPUserSchema>;

export const UserSchema = Type.Object({
    id: Type.Optional(Type.String()),
    username: Type.String(),
    tags: Type.Optional(Type.Array(Type.String())),
});

export type UserType = Static<typeof UserSchema>;

export const UserResposeSchema = Type.Union([
    Type.Optional(Type.Array(UserSchema)),
    Type.Object({
        valid: Type.Boolean(),
    }),
]);

export type UserResposeType = Static<typeof UserResposeSchema>;
