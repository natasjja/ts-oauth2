import { Client, Token, Falsey } from "oauth2-server";
import { User } from "../db/users";
import { getUserFromDb } from "../services/user";

const client: Client = {
  id: "",
  clientId: "vbfg90b90dtfg",
  clientSecret: "-0i9mcgbjcvbj",
  grants: ["password"],
  redirectUris: [""],
};

const db = {
  authorizationCode: {
    authorizationCode: "",
    expiresAt: new Date(),
    redirectUri: "",
    client: undefined,
    user: null,
  },
  client,
  token: {
    accessToken: "",
    accessTokenExpiresAt: new Date(),
    client: client,
    user: {
      username: "",
    },
  },
};

const getClient = (clientID, clientSecret, cb) => {
  return cb(false, db.client);
};

const getUser = async (username, password, cb): Promise<User | Falsey> => {
  const user = await getUserFromDb(username, password);

  console.log("Got user: ", user?.username);

  return cb(user === null ? "User credentials are incorrect" : false, user);
};

const saveToken = (token, client, user, cb): Promise<Token | Falsey> => {
  db.token = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client: client,
    user: user,
  };

  console.log("Saving token: ", token);

  return cb(token ? false : true, db.token);
};

const getAccessToken = (accessToken, cb): Promise<Token | Falsey> => {
  const noToken = !accessToken || accessToken === "undefined";

  const matchedTokens = accessToken === db.token.accessToken;

  return cb(noToken ? true : false, matchedTokens ? accessToken : null);
};

const verifyScope = (token, scope, cb): Promise<boolean> => {
  const userHasAccess = true;
  return cb(false, userHasAccess);
};

export const model = {
  getClient,
  getUser,
  saveToken,
  getAccessToken,
  verifyScope,
};
