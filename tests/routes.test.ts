import { app, server } from "../src/index";
import request from "supertest";

import {
  getClient,
  getUser,
  saveToken,
  getAccessToken,
} from "../src/oauth/model";

jest.mock("../src/oauth/model", () => ({
  getClient: jest.fn(),
  getUser: jest.fn(),
  saveToken: jest.fn(),
  getAccessToken: jest.fn(),
}));

const mockModel = {
  client: {
    id: "",
    clientId: "123",
    clientSecret: "123",
    grants: ["password"],
  },
  token: {
    accessToken: "123",
    accessTokenExpiresAt: new Date(),
    client: {
      id: "",
      clientId: "123",
      clientSecret: "123",
      grants: ["password"],
    },
    user: {
      username: "Tasja",
    },
  },
};

afterEach((done) => {
  server.unref();
  done();
});

describe("POST /register", () => {
  it("returns status code 200 if username and password is passed", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "John", password: "123" });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("You're now successfully registered");
  });

  it("returns status code 400 if username and password is not passed", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "", password: "123" });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Please choose a username and password");
  });
});

describe("POST /token", () => {
  beforeEach(() => {
    (getClient as jest.Mock).mockReturnValueOnce(mockModel.client);
    (saveToken as jest.Mock).mockReturnValueOnce(mockModel.token);
  });

  jest.mock("express-oauth-server", () => {
    return {
      token: () => {
        return {
          access_token: "123",
          token_type: "Bearer",
          expires_in: 3599,
        };
      },
    };
  });

  it("returns status code 200 and returns bearer for valid user", async () => {
    (getUser as jest.Mock).mockReturnValueOnce({ username: "Tasja" });

    const res = await request(app)
      .post("/token")
      .set("Authorization", "Basic MTIzOjEyMw==")
      .set("Content-type", "application/x-www-form-urlencoded")
      .send("grant_type=password&username=Tasja&password=password");

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(
      '{"access_token":"123","token_type":"Bearer","expires_in":-1}'
    );
  });

  it("returns status code 400 and returns error for invalid user", async () => {
    (getUser as jest.Mock).mockReturnValueOnce(false);

    const res = await request(app)
      .post("/token")
      .set("Authorization", "Basic MTIzOjEyMw==")
      .set("Content-type", "application/x-www-form-urlencoded")
      .send("grant_type=password&username=WrongUser&password=password");

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(
      '{"error":"invalid_grant","error_description":"Invalid grant: user credentials are invalid"}'
    );
  });
});

describe("POST /secure", () => {
  beforeEach(() => {
    (getClient as jest.Mock).mockReturnValueOnce(mockModel.client);
    (getUser as jest.Mock).mockReturnValueOnce(mockModel.token.user);
  });

  jest.mock("express-oauth-server", () => {
    return {
      authenticate: () => {
        return {
          accessToken: "123",
          accessTokenExpiresAt: new Date("3000-05-12T23:50:21.817Z"),
          client: {
            id: "",
            clientId: "123",
            clientSecret: "123",
            grants: ["password"],
          },
          user: {
            username: "Tasja",
          },
        };
      },
    };
  });

  it("returns status code 200 and returns secure message for authenticated user", async () => {
    (getAccessToken as jest.Mock).mockReturnValueOnce({
      accessToken: "123",
      accessTokenExpiresAt: new Date("3000-05-12T23:50:21.817Z"),
      client: {
        id: "",
        clientId: "123",
        clientSecret: "123",
        grants: ["password"],
      },
      user: {
        username: "Tasja",
      },
    });

    const res = await request(app)
      .post("/secure")
      .set("Authorization", "Bearer MTIz")
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Welcome to this secure page, Tasja!");
  });

  it("returns status code 400 and returns error for unauthenticated user", async () => {
    (getAccessToken as jest.Mock).mockReturnValueOnce(false);

    const res = await request(app)
      .post("/secure")
      .set("Authorization", "Bearer MTinvalidtoken")
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual(
      '{"error":"invalid_token","error_description":"Invalid token: access token is invalid"}'
    );
  });
});
