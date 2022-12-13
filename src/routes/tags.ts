import { FastifyInstance, FastifyRequest } from "fastify";

interface BodyType {
    value: string;
}

export default async function tags(fastify: FastifyInstance) {
    const { prisma } = fastify;

    fastify.get("/tags", async () => {
        const tags = await prisma.tag.findMany();
        return { tags };
    });

    fastify.get("/tags/:id", async (req: FastifyRequest<{ Params: { id: number } }>, _) => {
        const { id } = req.params;
        const intNum = Number(id);
        const tag = await prisma.tag.findUnique({
            where: {
                id: intNum,
            },
        });
        return { tag };
    });

    fastify.post("/tags", async (req: FastifyRequest<{ Body: BodyType }>) => {
        const { value } = req.body;

        const tag = await prisma.tag.create({ data: { value: value } });
        return { tag };
    });

    fastify.delete("/tags/:id", async (req: FastifyRequest<{ Params: { id: number } }>, _) => {
        const { id } = req.params;
        const intNum = Number(id);
        const deletedTag = await prisma.tag.delete({
            where: {
                id: intNum,
            },
        });
        return { tag: deletedTag };
    });
}
