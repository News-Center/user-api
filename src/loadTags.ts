import ldap, { SearchOptions } from "ldapjs";
import { logger } from "./utils/logger";

const HOSTNAME = "ldap://ldap.technikum-wien.at";
const LDAP_PORT = 389;

export const loadAllTags = async (username: string, password: string): Promise<{ success: boolean; ous: string[] }> => {
    const userRootDN = `uid=${username},ou=People,dc=technikum-wien,dc=at`;
    const groupBaseDN = "ou=group,dc=technikum-wien,dc=at";
    // TODO: update code to use SSL
    const client = ldap.createClient({
        url: HOSTNAME + ":" + LDAP_PORT,
    });

    const bindErr = await new Promise<Error | null>(resolve => {
        client.bind(userRootDN, password, err => {
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
        attributes: ["cn"],
    };

    const searchErr = await new Promise<Error | null>((resolve, reject) => {
        client.search(groupBaseDN, searchOptions, (err, res) => {
            if (err) {
                return reject(err);
            }
            res.on("searchEntry", entry => {
                const { cn } = entry.object;

                if (cn) {
                    if (typeof cn === "string") ous.push(cn);
                    else ous = cn;
                }
            });

            res.on("error", err => {
                if (err.message !== "Size Limit Exceeded") return reject(err);
                else return resolve(null);
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
