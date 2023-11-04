// prisma/seed.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.phase.upsert({
        where: { name: "Phase 1: Fuzzy Search" },
        update: {},
        create: {
            name: "Phase 1: Fuzzy Search",
            description:
                "In der Nachricht und Titel wird nach allen Tags gesucht. Es wird eine Fuzzy (unscharfe) Suche verwendet.",
        },
    });

    await prisma.phase.upsert({
        where: { name: "Phase 2: Fuzzy Thesaurus Search" },
        update: {},
        create: {
            name: "Phase 2: Fuzzy Thesaurus Search",
            description:
                "In der Nachricht und Titel wird nach Synonymen für jedes Tag gesucht. Es handelt sich ebenfalls um eine (strengere) Fuzzy Search.",
        },
    });

    await prisma.phase.upsert({
        where: { name: "Phase 3: Fuzzy LDAP Search" },
        update: {},
        create: {
            name: "Phase 3: Fuzzy LDAP Search",
            description:
                "In der Nachricht und Titel wird nach allen LDAP-Tags gesucht. Die LDAP-Tags werden aktuell beim erstmaligen User-Login erstellt, da wir OUs nur auf Userbasis erhalten.",
        },
    });

    await prisma.phase.upsert({
        where: { name: "Phase 4: Fuzzy LDAP Thesaurus Search" },
        update: {},
        create: {
            name: "Phase 4: Fuzzy LDAP Thesaurus Search",
            description: "In der Nachricht und Titel wird nach Synonymen für jedes LDAP-Tag gesucht.",
        },
    });
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
