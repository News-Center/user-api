import { FastifyInstance } from "fastify";

import { UserResposeType, UserResposeSchema, LDAPUserSchema, LDAPUserType } from "../../schema/user";
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
                    200: {
                        description: "Successfull response",
                        ...UserResposeSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { username, password } = request.body;
            const authResponse = await authUser(username, password);

            if (authResponse) {
                const createdUser = await prisma.user.upsert({
                    where: { username },
                    update: {},
                    create: { username },
                });
                return { valid: authResponse, user: createdUser };
            }
            return { valid: authResponse, user: null };
        },
    );
}
