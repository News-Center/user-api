import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import prismaPlugin from "./plugins/prisma";
import ldapRoute from "./routes/authenticate";

export function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
    const app = fastify(opts);

    app.register(prismaPlugin);

    app.register(ldapRoute, { prefix: "/api/ldap" });

    return app;
}
