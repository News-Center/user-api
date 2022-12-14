import { FastifyInstance, FastifyRequest } from "fastify";
interface BodyType {
    value: string;
}

export default async function (fastify: FastifyInstance) {
    const { prisma } = fastify;

    fastify.get("/", async () => {
        const tags = await prisma.tag.findMany();
        return { tags };
    });

    fastify.get("/:id", async (req: FastifyRequest<{ Params: { id: string } }>, _) => {
        const { id } = req.params;
        const tag = await prisma.tag.findUnique({
            where: {
                id: id,
            },
        });
        return { tag };
    });

    fastify.post("/", async (req: FastifyRequest<{ Body: BodyType }>) => {
        const { value } = req.body;

        const tag = await prisma.tag.create({ data: { value: value } });
        return { tag };
    });

    fastify.delete("/:id", async (req: FastifyRequest<{ Params: { id: string } }>, _) => {
        const { id } = req.params;
        const deletedTag = await prisma.tag.delete({
            where: {
                id: id,
            },
        });
        return { tag: deletedTag };
    });
}
