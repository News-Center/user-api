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
    UserResposeType,
    UserResposeSchema,
    UserAutoSubscribeBodyType,
    UserAutoSubscribeBodySchema,
    UserPreferredTimeBodyType,
    UserPreferredTimeBodySchema,
    UserBodyLikesSchema,
    UserBodyLikesType,
    UserSchemaWithoutTags,
} from "../../schema/user";

import {
    UserSchema,
    UserSchemaWithoutTagsType,
    UserType,
    UserWithPhasesSchema,
    UserWithPhasesType,
} from "../../schema/tagUser";
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

import { PhasesResponseSchema, PhasesResponseType } from "../../schema/phase";

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
        "/:id",
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

            fastify.log.info(user);
            return user;
        },
    );

    fastify.delete<{ Params: UserParamsType; Reply: UserType }>(
        "/:id",
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
        "/:id/tags",
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
        "/:id/tags",
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
        "/:id/tags/:tid",
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

    fastify.get<{ Params: UserParamsType; Reply: PhasesResponseType }>(
        "/:id/phases",
        {
            schema: {
                description: "Returns a User with Tag",
                tags: ["user"],
                params: UserParamsSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...PhasesResponseSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;

            const phases = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    phases: true,
                },
            });

            if (phases === null) return { phases: null };

            return phases;
        },
    );

    fastify.patch<{ Body: UserBodyType; Params: UserParamsType; Reply: UserWithPhasesType }>(
        "/:id/phases",
        {
            schema: {
                description: "Add phases to user",
                tags: ["user", "phase"],
                params: UserParamsSchema,
                body: UserBodySchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserWithPhasesSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const { value } = request.body;

            const user = await userHelper.getUserWithPhaseById(fastify, id);

            if (user?.phases) {
                await userHelper.disconnectPhasesFromUser(fastify, id);
            }

            return await userHelper.connectPhasesToUser(
                fastify,
                id,
                value.map(ids => ids.id),
            );
        },
    );

    fastify.patch<{ Body: UserBodyLikesType; Params: UserParamsType; Reply: UserSchemaWithoutTagsType }>(
        "/:id/likes",
        {
            schema: {
                description: "Add likes to user",
                tags: ["user", "likes"],
                params: UserParamsSchema,
                body: UserBodyLikesSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserSchemaWithoutTags,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const { like } = request.body;

            const likes = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    likes: true,
                },
            });

            // wtf
            let updatedLikes;
            if (likes && likes.likes.includes(like)) {
                // toggle like if already liked
                fastify.log.info("TOGGLE LIKE");
                updatedLikes = likes.likes.filter(l => l != like);
            } else if (likes) {
                fastify.log.info("ADD LIKE");
                likes.likes.push(like);
                updatedLikes = likes.likes;
            } else {
                fastify.log.info("likes");
                updatedLikes = [like];
            }

            fastify.log.info(updatedLikes);
            fastify.log.info(updatedLikes.length);
            const user = await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    likes: updatedLikes,
                },
            });

            return user;
        },
    );

    fastify.patch<{ Body: UserAutoSubscribeBodyType; Params: UserParamsType; Reply: UserResposeType }>(
        "/:id/phases/auto",
        {
            schema: {
                description: "Toggle auto subscribe for phases",
                tags: ["user", "phase"],
                params: UserParamsSchema,
                body: UserAutoSubscribeBodySchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserResposeSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const { autoSubscribe } = request.body;

            const user = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    autoSubscribe,
                },
            });

            return { user, valid: false };
        },
    );

    fastify.patch<{ Body: UserPreferredTimeBodyType; Params: UserParamsType; Reply: UserResposeType }>(
        "/:id/preferredTime",
        {
            schema: {
                description: "Set preferredTime to receive messages",
                tags: ["user", "phase"],
                params: UserParamsSchema,
                body: UserPreferredTimeBodySchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...UserResposeSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const { preferredStartTime, preferredEndTime } = request.body;

            const user = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    preferredStartTime,
                    preferredEndTime,
                },
            });

            return { user, valid: false };
        },
    );
}
