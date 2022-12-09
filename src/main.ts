import "dotenv/config";
import { Config } from "./config";
import { createServer } from "./app";

const server = createServer({ logger: { transport: { target: "pino-pretty" } } });

server.get("/", async (_, res) => {
    res.send({ msg: "welcome & world" });
});

try {
    server.listen({ port: Config.port, host: "0.0.0.0" });
} catch (err) {
    server.log.error(err);
    process.exit(1);
}

server.log.info(`Server listening at PORT:${Config.port}`);
