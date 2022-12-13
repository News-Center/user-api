import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import prismaPlugin from "./plugins/prisma";
import ldapRoute from "./routes/authenticate";
import tagRoute from "./routes/tags";

export function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
    const app = fastify(opts);

    app.register(prismaPlugin);

    app.register(ldapRoute, { prefix: "/api/ldap" });
    app.register(tagRoute, { prefix: "/api" });
    return app;
}
