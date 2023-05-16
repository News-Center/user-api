import { FastifyInstance } from "fastify";
import { UserType } from "../../schema/tagUser";

const getUserById = async (fastify: FastifyInstance, userId: number): Promise<UserType> => {
    const { prisma } = fastify;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            tags: true,
        },
    });

    return user;
};

export default getUserById;
