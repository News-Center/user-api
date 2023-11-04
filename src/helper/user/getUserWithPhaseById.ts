import { FastifyInstance } from "fastify";
import { UserWithPhasesType } from "../../schema/tagUser";

const getUserWithPhaseById = async (fastify: FastifyInstance, userId: number): Promise<UserWithPhasesType> => {
    const { prisma } = fastify;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            phases: true,
        },
    });

    return user;
};

export default getUserWithPhaseById;
