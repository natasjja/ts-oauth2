import { Token, Falsey, User, Client } from "oauth2-server";
import { getUserFromDb } from "../db/users";

const authDb = {
  client: {
    id: "",
    clientId: "vbfg90b90dtfg",
    clientSecret: "-0i9mcgbjcvbj",
    grants: ["password"],
    redirectUris: [""],
  },
  token: {
    accessToken: "",
    accessTokenExpiresAt: new Date(),
    client: {},
    user: {
      username: "",
    },
  },
};

const getClient = (clientId, clientSecret, cb): Promise<Client | Falsey> => {
  return cb(false, authDb.client);
};

const getUser = async (username, password, cb): Promise<User | Falsey> => {
  const user = await getUserFromDb(username, password);

  const dbUser = {
    username: user?.username,
  };

  console.log("Got user from db: ", user?.username);

  return cb(!user && "Couldn't get user", dbUser);
};

const saveToken = (token, client, user, cb): Promise<Token | Falsey> => {
  authDb.token = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
    client: authDb.client,
    user: user,
  };

  console.log("Saved token", authDb.token);

  return cb(!token && "Couldn't save token", authDb.token);
};

const getAccessToken = (accessToken, cb): Promise<Token | Falsey> => {
  const noToken = !accessToken || accessToken === "undefined";

  const matchedTokens = accessToken === authDb.token.accessToken;

  return cb(noToken, matchedTokens ? authDb.token : null);
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
