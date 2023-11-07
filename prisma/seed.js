// prisma/seed.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // MAKE SURE THE NAME IS UNIQUE
    const phasesToBeCreated = [
        {
            id: 1,
            name: "Phase 1: Fuzzy Search",
            description:
                "In der Nachricht und Titel wird nach allen Tags gesucht. Es wird eine Fuzzy (unscharfe) Suche verwendet.",
        },
        {
            id: 2,
            name: "Phase 2: Fuzzy Thesaurus Search",
            description:
                "In der Nachricht und Titel wird nach Synonymen für jedes Tag gesucht. Es handelt sich ebenfalls um eine (strengere) Fuzzy Search.",
        },
        {
            id: 3,
            name: "Phase 3: Fuzzy LDAP Search",
            description:
                "In der Nachricht und Titel wird nach allen LDAP-Tags gesucht. Die LDAP-Tags werden aktuell beim erstmaligen User-Login erstellt, da wir OUs nur auf Userbasis erhalten.",
        },
        {
            id: 4,
            name: "Phase 4: Fuzzy LDAP Thesaurus Search",
            description: "In der Nachricht und Titel wird nach Synonymen für jedes LDAP-Tag gesucht.",
        },
    ];

    const phasesFromDb = await prisma.phase.findMany({});
    console.log("Phases from DB: ", phasesFromDb.length);
    console.log("All phases: ", phasesToBeCreated.length);

    for (const phase of phasesToBeCreated) {
        await prisma.phase.upsert({
            where: { name: phase.name },
            update: {},
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

            console.log(`User ${user.id} is now subscribed to phases ${newPhaseIds}`);
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
