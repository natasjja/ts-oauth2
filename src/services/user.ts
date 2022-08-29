import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { addUser, findUser, User, usernameAlreadyExists } from "../db/users";
import { responseMessage } from "../helpers";

export const registerNewUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (usernameAlreadyExists(username)) {
    return responseMessage(
      res,
      `The username ${username} already exists, please choose a different one`,
      400
    );
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    addUser({
      username,
      password: hashedPassword,
    });

    return responseMessage(res, `You're now successfully registered`, 200);
  }
};

export const getUserFromDb = async (
  username,
  password
): Promise<User | null> => {
  const user = findUser(username);

  if (!user) {
    return null;
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  return matchedPassword ? user : null;
};
