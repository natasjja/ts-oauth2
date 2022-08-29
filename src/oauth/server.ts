import OAuthServer from "express-oauth-server";
import { model } from "./model";

export const oAuthServer = new OAuthServer({
  model,
});
