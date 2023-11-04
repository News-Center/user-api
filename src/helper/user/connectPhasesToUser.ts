import { FastifyInstance } from "fastify";
import { UserWithPhasesType } from "src/schema/tagUser";

const connectPhasesToUser = async (
    fastify: FastifyInstance,
    userId: number,
    phases: number[],
): Promise<UserWithPhasesType> => {
    const { prisma } = fastify;

    if (!phases) {
        return null;
    }

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            phases: {
                connect: phases.map(id => ({ id })),
            },
        },
        include: {
            phases: true,
        },
    });

    return user;
};

export default connectPhasesToUser;
