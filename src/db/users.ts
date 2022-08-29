import bcrypt from "bcrypt";

type User = {
  username: string;
  password: string;
};

const usersDb: User[] = [];

export const addUserToDb = async (user: User): Promise<void> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = { username: user.username, password: hashedPassword };

  usersDb.push(newUser);
  console.log("users: ", usersDb);
};

export const getUserFromDb = async (
  username: string,
  password: string
): Promise<User | null> => {
  const user = findUser(username);

  if (!user) {
    return null;
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  return matchedPassword ? user : null;
};

export const findUser = (username: string): User | undefined =>
  usersDb.find((u) => u.username === username);

export const usernameAlreadyExists = (username: string): boolean =>
  usersDb.some((u) => u.username === username);
