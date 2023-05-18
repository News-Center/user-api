import { FastifyInstance } from "fastify";
import * as userHelper from "../../helper/user/index";

import {
    UserParamsType,
    UserChannelParamsSchema,
    UserBodyType,
    UserBodySchema,
    UserTagsType,
    UserTagsSchema,
    UsersAndTagsType,
    UsersAndTagsSchema,
    UserParamsWithTagIdType,
    UserParamsWithTagIdSchema,
    UserChannelParamsType,
    UserParamsSchema,
} from "../../schema/user";

import { UserSchema, UserType } from "../../schema/tagUser";
import {
    ChannelsOnUserResponseType,
    ChannelsOnUserSchema,
    ChannelOnUserBodySchema,
    ChannelOnUserBodyType,
    ErrorResponseType,
    ErrorResponse,
    ChannelOnUserSchema,
    ChannelOnUserType,
} from "../../schema/channel";

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
                params: UserChannelParamsSchema,
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
                params: UserChannelParamsSchema,
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
                params: UserChannelParamsSchema,
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
                params: UserChannelParamsSchema,
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

    fastify.get<{ Params: UserParamsType; Reply: ChannelsOnUserResponseType }>(
        "/:id/channels",
        {
            schema: {
                description: "Return all Channels User joined",
                tags: ["user"],
                params: UserParamsSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...ChannelsOnUserSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;

            const channels = await prisma.userOnChannel.findMany({
                where: {
                    userId: id,
                },
                select: {
                    handle: true,
                    channel: true,
                },
            });

            return channels;
        },
    );

    fastify.post<{
        Params: UserChannelParamsType;
        Body: ChannelOnUserBodyType;
        Reply: ChannelOnUserType | ErrorResponseType;
    }>(
        "/:id/channels/:cid",
        {
            schema: {
                description: "Add a channel to a user",
                tags: ["user"],
                params: UserChannelParamsSchema,
                body: ChannelOnUserBodySchema,
                response: {
                    "2XX": {
                        description: "Successful response",
                        ...ChannelOnUserSchema,
                    },
                    400: {
                        description: "Bad request",
                        ...ErrorResponse,
                    },
                },
            },
        },
        async (request, reply) => {
            const { id, cid } = request.params;
            const { handle } = request.body;

            const user = await prisma.user.findUnique({ where: { id: id } });
            const channel = await prisma.channel.findUnique({ where: { id: cid } });

            if (!user || !channel) {
                reply.status(400).send({ error: "Could not find user or channel with the provided id" });
                return;
            }

            const userOnChannel = await prisma.userOnChannel.upsert({
                where: {
                    userId_channelId: {
                        userId: user.id,
                        channelId: channel.id,
                    },
                },
                create: {
                    handle: handle,
                    userId: user.id,
                    channelId: channel.id,
                },
                update: {},
            });

            reply.status(201).send({
                handle: userOnChannel.handle,
                userId: userOnChannel.userId,
                channelId: userOnChannel.channelId,
            });
        },
    );

    fastify.patch<{
        Params: UserChannelParamsType;
        Body: ChannelOnUserBodyType;
        Reply: ChannelOnUserType | ErrorResponseType;
    }>(
        "/:id/channels/:cid",
        {
            schema: {
                description: "Update a user's handle",
                tags: ["user"],
                params: UserChannelParamsSchema,
                body: ChannelOnUserBodySchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...ChannelOnUserSchema,
                    },
                    400: {
                        description: "Bad request",
                        ...ErrorResponse,
                    },
                },
            },
        },
        async (request, reply) => {
            const { id, cid } = request.params;
            const { handle } = request.body;

            const user = await prisma.user.findUnique({ where: { id: id } });
            const channel = await prisma.channel.findUnique({ where: { id: cid } });

            if (!user || !channel) {
                reply.status(400).send({ error: "Could not find user or channel with the provided id" });
                return;
            }

            const userOnChannel = await prisma.userOnChannel.upsert({
                where: {
                    userId_channelId: {
                        userId: user.id,
                        channelId: channel.id,
                    },
                },
                create: {
                    handle: handle,
                    userId: user.id,
                    channelId: channel.id,
                },
                update: {
                    handle: handle,
                },
            });

            reply.status(201).send({
                handle: userOnChannel.handle,
                userId: userOnChannel.userId,
                channelId: userOnChannel.channelId,
            });
        },
    );

    fastify.delete<{ Params: UserChannelParamsType; Reply: ChannelOnUserType | ErrorResponseType }>(
        "/:id/channels/:cid",
        {
            schema: {
                description: "Remove a user from a channel",
                tags: ["user"],
                params: UserChannelParamsSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...ChannelOnUserSchema,
                    },
                    400: {
                        description: "Bad request",
                        ...ErrorResponse,
                    },
                },
            },
        },
        async (request, reply) => {
            const { id, cid } = request.params;

            const user = await prisma.user.findUnique({ where: { id: id } });
            const channel = await prisma.channel.findUnique({ where: { id: cid } });

            if (!user || !channel) {
                reply.status(400).send({ error: "Could not find user or channel with the provided id" });
                return;
            }

            const userOnChannel = await prisma.userOnChannel.findFirst({
                where: {
                    userId: user.id,
                    channelId: channel.id,
                },
            });

            if (!userOnChannel) {
                reply.status(400).send({ error: "User is not a member of the channel" });
                return;
            }

            await prisma.userOnChannel.delete({
                where: {
                    userId_channelId: {
                        userId: user.id,
                        channelId: channel.id,
                    },
                },
            });

            reply.status(204).send({
                handle: userOnChannel.handle,
                userId: userOnChannel.userId,
                channelId: userOnChannel.channelId,
            });
        },
    );
}
