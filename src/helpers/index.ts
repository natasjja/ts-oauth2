import { Response } from 'express';
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
};

export const responseMessage = (res: Response, message: string, statusCode: number) => {
    return res
    .status(statusCode)
    .send({ message });
};