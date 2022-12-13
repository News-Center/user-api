import { FastifyInstance, FastifyRequest } from "fastify";
import { authUser } from "../ldap";

interface BodyType {
    username: string;
    password: string;
}

export default async function auth(fastify: FastifyInstance) {
    const { prisma } = fastify;

    fastify.post("/", async (req: FastifyRequest<{ Body: BodyType }>, _) => {
        const { username, password } = req.body;
        const authResponse = await authUser(username, password);

        if (authResponse) {
            const createdUser = await prisma.user.create({ data: { username } });
            return { valid: authResponse, user: createdUser };
        }
        return { valid: authResponse };
    });
}
