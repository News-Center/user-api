/* eslint-disable */
// prisma/seed.js

import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
    const phasesToBeCreated = JSON.parse(fs.readFileSync("prisma/phases.json", "utf-8"));

    const phasesFromDb = await prisma.phase.findMany({});
    console.log("Phases from DB: ", phasesFromDb.length);
    console.log("All phases: ", phasesToBeCreated.length);

    for (const phase of phasesToBeCreated) {
        await prisma.phase.upsert({
            where: { id: phase.id },
            update: {
                name: phase.name,
                description: phase.description,
            },
            create: {
                id: phase.id,
                name: phase.name,
                description: phase.description,
            },
        });
    }

    const phasesToBeCreatedIds = phasesToBeCreated.map(phase => phase.id);
    const phasesFromDbIds = phasesFromDb.map(phase => phase.id);

    const newPhaseIds = phasesToBeCreatedIds.filter(id => !phasesFromDbIds.includes(id));
    console.log("Phase IDs to be created: ", newPhaseIds);

    if (newPhaseIds.length > 0) {
        const usersWithAutoSubscribe = await prisma.user.findMany({
            where: {
                autoSubscribe: true,
            },
            select: {
                username: true,
            },
        });
        console.log("Users with auto subscribe: ", usersWithAutoSubscribe.length);

        async function subscribeUserToNewPhases(user, newPhaseIds) {
            await prisma.user.update({
                where: {
                    username: user.username,
                },
                data: {
                    phases: {
                        connect: newPhaseIds.map(id => ({ id })),
                    },
                },
                include: {
                    phases: true,
                },
            });

            console.log(`User ${user.username} is now also subscribed to phases [${newPhaseIds}]`);
        }

        for (const user of usersWithAutoSubscribe) {
            await subscribeUserToNewPhases(user, newPhaseIds);
        }
    }
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
