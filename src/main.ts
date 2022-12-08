import "dotenv/config";
import { Config } from "./config.js";
import { authUser } from "./ldap.js";

const rValue = await authUser(Config.ldapUsername, Config.ldapPassword);

//eslint-disable-next-line no-console
console.log("Login ", rValue);
