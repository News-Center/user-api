import ldap, { SearchOptions } from "ldapjs";
import { logger } from "./utils/logger";

const HOSTNAME = "ldap://ldap.technikum-wien.at";
const LDAP_PORT = 389;

// Autenticates a User using the CIS username and password
// Returns true if authentication was successful otherwise false
export const authUser = async (username: string, password: string): Promise<boolean> => {
    const rootDN = "uid=" + username + ",ou=People,dc=technikum-wien,dc=at";

    // TODO: update code to use SSL
    const client = ldap.createClient({
        url: HOSTNAME + ":" + LDAP_PORT,
    });

    const bindErr = await new Promise(resolve => {
        client.bind(rootDN, password, err => {
            return resolve(err);
        });
    });

    client.unbind(err => {
        if (err) logger.info(err);
    });

    return !bindErr;
};

export const getUserInfo = async (username: string, password: string): Promise<{ success: boolean; ous: string[] }> => {
    const rootDN = `uid=${username},ou=People,dc=technikum-wien,dc=at`;

    // TODO: update code to use SSL
    const client = ldap.createClient({
        url: HOSTNAME + ":" + LDAP_PORT,
    });

    const bindErr = await new Promise<Error | null>(resolve => {
        client.bind(rootDN, password, err => {
            return resolve(err);
        });
    });

    if (bindErr) {
        client.unbind(err => {
            if (err) {
                logger.info(err);
            }
        });

        return {
            success: false,
            ous: [],
        };
    }

    let ous: string[] = [];

    const searchOptions: SearchOptions = {
        scope: "sub",
        filter: `(uid=${username})`,
        attributes: ["ou"],
    };

    const searchErr = await new Promise<Error | null>((resolve, reject) => {
        client.search(rootDN, searchOptions, (err, res) => {
            if (err) {
                return reject(err);
            }
            res.on("searchEntry", entry => {
                const { ou } = entry.object;

                if (typeof ou === "string") {
                    ous.push(ou);
                } else if (Array.isArray(ou)) {
                    ous = ou;
                }
            });

            res.on("error", err => {
                return reject(err);
            });

            res.on("end", () => {
                return resolve(null);
            });
        });
    });

    client.unbind(err => {
        if (err) {
            logger.info(err);
        }
    });

    return {
        success: !searchErr,
        ous: ous,
    };
};
