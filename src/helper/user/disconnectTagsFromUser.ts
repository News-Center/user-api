import { FastifyInstance } from "fastify";

const disconnectTagsFromUser = async (fastify: FastifyInstance, userId: string): Promise<void> => {
    const { prisma } = fastify;

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            tags: {
                set: [],
            },
        },
    });
};

export default disconnectTagsFromUser;
