import { Request, Response } from 'express';
import { addUser, userAlreadyExists } from '../db/users';
import { hashPassword, responseMessage } from '../helpers';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username;
        const password: string  = req.body.password;

        if (userAlreadyExists(username)) {
            return responseMessage(res, `The username ${username} already exists, please choose a different one`, 400);
        } else {
            const hashedPassword = await hashPassword(password);

            addUser({
                username,
                password: hashedPassword
            });

            return responseMessage(res, `You're now successfully registered, ${username}`, 200);
        }
    } catch (err) {
        return responseMessage(res, `There was an issue registering you, please try again.`, 400);
    }
};


