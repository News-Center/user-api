import { FastifyInstance } from "fastify";

const disconnectTagsFromUser = async (
    fastify: FastifyInstance,
    userId: string,
    tags: (string | undefined)[],
): Promise<void> => {
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
                    disconnect: {
                        id: tag,
                    },
                },
            },
        });
    }
};

export default disconnectTagsFromUser;
