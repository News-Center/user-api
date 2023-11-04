import { FastifyInstance } from "fastify";

import {
    PhaseBodySchema,
    PhaseBodyType,
    PhaseResponseSchema,
    PhasesResponseSchema,
    PhasesResponseType,
    PhaseResponseType,
} from "../../schema/phase";

export default async function (fastify: FastifyInstance) {
    const { prisma } = fastify;

    fastify.get<{ Reply: PhasesResponseType }>(
        "/",
        {
            schema: {
                description: "",
                tags: ["phase"],
                response: {
                    200: {
                        description: "Successful response",
                        ...PhasesResponseSchema,
                    },
                },
            },
        },
        async (_request, _reply) => {
            const phases = await prisma.phase.findMany();
            return { phases };
        },
    );

    fastify.post<{ Body: PhaseBodyType; Reply: PhaseResponseType }>(
        "/",
        {
            schema: {
                description: "Create Phase",
                tags: ["Phase"],
                body: PhaseBodySchema,
                response: {
                    200: {
                        description: "Successful response",
                        ...PhaseResponseSchema,
                    },
                },
            },
        },
        async (request, _reply) => {
            const { name, description } = request.body;

            const phase = await prisma.phase.upsert({
                where: { name },
                update: {},
                create: { name, description, createdAt: new Date() },
            });

            return { phase };
        },
    );
}
