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
        return { valide: authResponse };
    });

    fastify.get("/", async (_, res) => {
        const allUsers = await prisma.user.findMany();
        fastify.log.info(allUsers);
        res.send({ msg: "hello world" });
    });

    fastify.get("/idk", async (_, res) => {
        res.send({ msg: "I JUST CHANGED THIS RANDOM world" });
    });
}
