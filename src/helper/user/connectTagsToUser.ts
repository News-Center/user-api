import { FastifyInstance } from "fastify";

const connectTagsToUser = async (fastify: FastifyInstance, userId: string, tags: string[]): Promise<void> => {
    const { prisma } = fastify;

    if (!tags) {
        return;
    }

    for (const tag of tags) {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                tags: {
                    connect: {
                        id: tag,
                    },
                },
            },
        });
    }
};

export default connectTagsToUser;
