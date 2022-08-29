import { Request, Response } from "express";
import { addUserToDb, usernameAlreadyExists } from "../db/users";
import { responseMessage } from "../helpers";

export const registerNewUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!password || !username) {
      return responseMessage(res, `Please choose a username and password`, 400);
    }

    if (usernameAlreadyExists(username)) {
      return responseMessage(
        res,
        `The username ${username} already exists, please choose a different one`,
        400
      );
    }

    addUserToDb({
      username,
      password,
    });

    return responseMessage(res, `You're now successfully registered`, 200);
  } catch {
    return responseMessage(
      res,
      `There was an issue registering you, please try again.`,
      400
    );
  }
};

export const helloAuthenticatedUser = (req, res) => {
  responseMessage(
    res,
    `Welcome to this secure page, ${res.locals.oauth.token.user.username}!`,
    200
  );
};
