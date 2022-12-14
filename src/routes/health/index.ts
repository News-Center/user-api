import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
    fastify.get(
        "/",
        {
            schema: {
                description: "This is an endpoint for application health check",
                tags: ["health"],
                response: {
                    200: {
                        description: "Success Response",
                        type: "object",
                        properties: {
                            msg: { type: "string" },
                        },
                    },
                },
            },
        },
        (_, reply) => {
            reply.send({ msg: "The Application is Up and Running" });
        },
    );
}
