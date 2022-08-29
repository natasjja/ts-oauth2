export type User = {
  username: string;
  password: string;
};

export const users: User[] = [];

export const addUser = (user: User) => {
  users.push(user);
  console.log("users: ", users);
};

export const findUser = (username: string): User | undefined =>
  users.find((u) => u.username === username);

export const usernameAlreadyExists = (username: string): boolean =>
  users.some((u) => u.username === username);
