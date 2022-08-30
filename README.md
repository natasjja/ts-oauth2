# TypeScript Express and OAuth2 App

## OAuth2

Here is the flow of the OAuth2 Server I've implemented:

```
+--------+                               +---------------+                               
|        |------- Password Grant ------->|    OAuth2     |
|        |<------  Access Token  --------|    Server     |
|        |                               +---------------+        
| Client |                               
|        |                               +---------------+  
|        |-------- Access Token -------->|    Resource   |                             
|        |<----- Protected Resource -----|     Server    |
|        |                               +---------------+
+--------+        
```

As this demo doesn't involve interaction with a real client with redirect uris, the verification of the client hasn't been included.

## Usage

- Run `npm run dev` to run the local server. 
- You can test the below endpoints with the `REST Client` VSCode extension, and calling the endpoints from the `request.rest` file.
- Run `npm test` for route tests.

## Endpoints

### /register

You can register a user and password to an in memory db, simply pass the following structure as a JSON request type:

```
{
    "username": "User",
    "password": "yourpassword"
}
```

Passwords are encrypted before being stored.

### /token

Next, the user can request an access token based on their registration credentials. The clientId and clientSecret must be passed in the Authorization headers as a base64 encoded string in the format `clientId:clientSecret`.  The content type also must be provided as `x-www-form-urlencoded`.

```
Authorization: Basic MTIzOjEyMw==
Content-Type: application/x-www-form-urlencoded
```


If they have successfully registered, they will receive a valid token back as a response:

```
{
    "access_token": "some-token-example",
    "token_type": "Bearer",
    "expires_in": 3599
}
```

### /secure

Finally, the user can request access to a secure route if they have been authenticated with a valid access token. The access_token value from the previous endpoint can be used to make the request.

```
Authorization: Bearer some-token-example
```

If they are successfully authenticated, they will receive access to the endpoint:
```
Welcome to this secure page, User!
```