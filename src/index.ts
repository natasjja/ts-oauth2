import bodyParser from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import { oAuthServer } from "./oauth/server";
import dotenv from "dotenv";
import { helloAuthenticatedUser, registerNewUser } from "./routes/user";

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/register", (req: Request, res: Response) =>
  registerNewUser(req, res)
);

app.post("/token", (req: Request, res: Response, next: NextFunction) => {
  oAuthServer.token()(req, res, next);
});

app.post("/secure", oAuthServer.authenticate(), helloAuthenticatedUser);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
