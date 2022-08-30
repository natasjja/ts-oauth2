import OAuthServer from "express-oauth-server";
import {
  getClient,
  getUser,
  saveToken,
  getAccessToken,
  verifyScope,
} from "./model";

export const oAuthServer = new OAuthServer({
  model: {
    getClient,
    getUser,
    saveToken,
    getAccessToken,
    verifyScope,
  },
});
