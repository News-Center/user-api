import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import { UserSchema, UserResposeType, LDAPUserSchema, LDAPUserType } from "../../schema/user";
import { authUser } from "../../ldap";

export default async function (fastify: FastifyInstance) {
    const { prisma } = fastify;

    fastify.post<{ Body: LDAPUserType; Reply: UserResposeType }>(
        "/",
        {
            schema: {
                description: "Authenticate a user with their CIS Username and Password",
                tags: ["ldap"],
                body: LDAPUserSchema,
                response: {
                    200: Type.Object(
                        {
                            valid: Type.Boolean(),
                            user: Type.Union([UserSchema, Type.Null()]),
                        },
                        {
                            description: "Successful response",
                        },
                    ),
                },
            },
        },
        async (request, _reply) => {
            const { username, password } = request.body;
            const authResponse = await authUser(username, password);
            if (authResponse) {
                const createdUser = await prisma.user.create({ data: { username } });
                return { valid: authResponse, user: createdUser };
            }
            return { valid: authResponse, user: null };
        },
    );
}
