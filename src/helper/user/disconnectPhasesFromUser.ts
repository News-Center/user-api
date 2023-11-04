import { FastifyInstance } from "fastify";

const disconnectPhasesFromUser = async (fastify: FastifyInstance, userId: number): Promise<void> => {
    const { prisma } = fastify;

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            phases: {
                set: [],
            },
        },
    });
};

export default disconnectPhasesFromUser;
