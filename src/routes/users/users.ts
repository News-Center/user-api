import { FastifyInstance } from "fastify";
import * as userHelper from "../../helper/user/index";

import {
    UserParamsType,
    UserParamsSchema,
    UserBodyType,
    UserBodySchema,
    UserTagsType,
    UserTagsSchema,
    UsersAndTagsType,
    UsersAndTagsSchema,
    UserParamsWithTagIdType,
    UserParamsWithTagIdSchema,
} from "../../schema/user";
import { UserSchema, UserType } from "../../schema/tagUser";

export default async function (fastify: FastifyInstance) {
    const { prisma } = fastify;

    fastify.get<{ Reply: UsersAndTagsType }>(
        "/",
        {
            schema: {
                description: "Returns all Users and their Tags",
                tags: ["user"],
                response: {
                    200: {
                        description: "Successful response",
                        ...UsersAndTagsSchema,
                    },
                },
            },
        },
        async (_, _reply) => {
            const users = await prisma.user.findMany({
                include: {
                    tags: true,
                    channels: false,
                },
            });

            return { users };
        },
    );

    fastify.get<{ Params: UserParamsType; Reply: UserType }>(
        "/:id/",
        {
            schema: {
                description: "Returns a User with Tag",
                tags: ["user"],
                params: UserParamsSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                include: {
                    tags: true,
                },
            });

            return user;
        },
    );

    fastify.delete<{ Params: UserParamsType; Reply: UserType }>(
        "/:id/",
        {
            schema: {
                description: "Deletes a User",
                tags: ["user"],
                params: UserParamsSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const user = await prisma.user.delete({
                where: {
                    id: id,
                },
                include: {
                    tags: true,
                },
            });
            return user;
        },
    );

    fastify.get<{ Params: UserParamsType; Reply: UserTagsType }>(
        "/:id/tags/",
        {
            schema: {
                description: "Returns all Tags of a User",
                tags: ["user"],
                params: UserParamsSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserTagsSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const tags = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    tags: true,
                },
            });

            return tags;
        },
    );

    fastify.patch<{ Body: UserBodyType; Params: UserParamsType; Reply: UserType }>(
        "/:id/tags/",
        {
            schema: {
                description: "Add Tags to User",
                tags: ["user"],
                params: UserParamsSchema,
                body: UserBodySchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const { value } = request.body;

            const user = await userHelper.getUserById(fastify, id);

            if (user?.tags) {
                await userHelper.disconnectTagsFromUser(fastify, id);
            }

            return await userHelper.connectTagsToUser(
                fastify,
                id,
                value.map(ids => ids.id),
            );
        },
    );

    fastify.delete<{ Params: UserParamsWithTagIdType; Reply: UserType }>(
        "/:id/tags/:tid/",
        {
            schema: {
                description: "Removes a Tag from the User",
                tags: ["user"],
                params: UserParamsWithTagIdSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id, tid } = request.params;

            const user = await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    tags: {
                        disconnect: {
                            id: tid,
                        },
                    },
                },
                include: {
                    tags: true,
                },
            });

            return user;
        },
    );
}
