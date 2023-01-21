import { FastifyInstance } from "fastify";
import { UserType } from "src/schema/tagUser";

const connectTagsToUser = async (fastify: FastifyInstance, userId: string, tags: string[]): Promise<UserType> => {
    const { prisma } = fastify;

    if (!tags) {
        return null;
    }

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            tags: {
                connect: tags.map(id => ({ id })),
            },
        },
        include: {
            tags: true,
        },
    });

    return user;
};

export default connectTagsToUser;
