export const Config = {
    ldapUsername: process.env.LDAP_USERNAME || "",
    ldapPassword: process.env.LDAP_PASSWORD || "",
    port: parseInt(process.env.PORT || "8080"),
};
