import { FastifyInstance } from "fastify";

import {
    TagsResponseType,
    TagsResponseSchema,
    TagResponseType,
    TagResponseSchema,
    TagParamsType,
    TagParamsSchema,
    TagBodySchema,
    TagBodyType,
} from "../../schema/tag";

export default async function (fastify: FastifyInstance) {
    const { prisma } = fastify;

    fastify.get<{ Reply: TagsResponseType }>(
        "/",
        {
            schema: {
                description: "Returns all tags in the Database",
                tags: ["tags"],
                response: {
                    200: {
                        description: "Successful response",
                        ...TagsResponseSchema,
                    },
                },
            },
        },
        async (_request, _reply) => {
            const tags = await prisma.tag.findMany();
            return { tags };
        },
    );

    fastify.get<{ Params: TagParamsType; Reply: TagResponseType }>(
        "/:id",
        {
            schema: {
                description: "Returns a Tag with the provided id if it exists",
                tags: ["tags"],
                params: TagParamsSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...TagResponseSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const tag = await prisma.tag.findUnique({
                where: {
                    id: id,
                },
            });
            return { tag };
        },
    );

    fastify.post<{ Body: TagBodyType; Reply: TagResponseType }>(
        "/",
        {
            schema: {
                description: "Creates a Tag with the provided value if it does not exist yet",
                tags: ["tags"],
                body: TagBodySchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...TagResponseSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { value } = request.body;

            const tag = await prisma.tag.upsert({
                where: { value },
                update: {},
                create: { value, updatedAt: new Date() },
            });

            return { tag };
        },
    );

    fastify.delete<{ Params: TagParamsType; Reply: TagResponseType }>(
        "/:id",
        {
            schema: {
                description: "Delete a tag by its ID if it exists",
                tags: ["tags"],
                params: TagParamsSchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...TagResponseSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const deletedTag = await prisma.tag.delete({
                where: {
                    id: id,
                },
            });
            return { tag: deletedTag };
        },
    );

    fastify.patch<{ Body: TagBodyType; Params: TagParamsType; Reply: TagResponseType }>(
        "/:id",
        {
            schema: {
                description: "Update a Tag by its ID if it exists",
                tags: ["tags"],
                params: TagParamsSchema,
                body: TagBodySchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...TagResponseSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { id } = request.params;
            const { value } = request.body;

            const patchedTag = await prisma.tag.update({
                where: {
                    id: id,
                },
                data: {
                    value,
                },
            });
            return { tag: patchedTag };
        },
    );
}
