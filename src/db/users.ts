type User = {
    username: string,
    password: string
}

const users: User[] = [];

export const addUser = (user: User) => {
    users.push(user);
    console.log("users: ", users);
}

export const userAlreadyExists = (username: string) => users.some(u => u.username === username);


