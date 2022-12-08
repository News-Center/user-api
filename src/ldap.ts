import ldap from "ldapjs";

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
        // eslint-disable-next-line
        if (err) console.log("ERR: ", err);
    });

    return !bindErr;
};
