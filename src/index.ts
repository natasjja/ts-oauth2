import bodyParser from "body-parser";
import express, {
  Express,
  NextFunction,
  request,
  Request,
  response,
  Response,
} from "express";
import { oAuthServer } from "./oauth/server";
import dotenv from "dotenv";
import { registerNewUser } from "./services/user";
import { responseMessage } from "./helpers";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/register", (req: Request, res: Response) => {
  try {
    registerNewUser(req, res);
  } catch (err) {
    return responseMessage(
      res,
      `There was an issue registering you, please try again.`,
      400
    );
  }
});

app.post("/token", (req: Request, res: Response, next: NextFunction) => {
  oAuthServer.token({ requireClientAuthentication: { password: false } })(
    req,
    res,
    next
  );
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
