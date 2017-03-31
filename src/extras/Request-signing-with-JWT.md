[JSON Web Token](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) (JWT) is a standard for signing requests with a pre-shared key.  It does not 'encrypt' data, but rather validates that a connecting client who has signed their request, has done so with this pre-shared key.

BipIO supports JWT signatures out of the box, and it generates a key during install which is written to your config file as `jwtKey`.  If you want to validate requests with JWT, share this secret with your connecting clients.  Clients should then sign their requests like so : 

Signature payload : 

  * ***path*** URI path, eg `/rest/bip`
  * ***body*** JSON payload for POST/PUT requests.  If your body is empty, you must sign against a `{}` payload.

You can generate a signature with any JWT library.  For NodeJS [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) is what's used on the server side, and what we're best able to support.

Once you've generated a payload signature, set it in your connecting client requests as the HTTP request header 'X-JWT-Signature'.

```
var jwt = require('jsonwebtoken');
var signature = jwt.sign(
  {
    path : "/res/bip",
    body : {
      "attribute" : "value"
    }
  },
  "secretsauce"
);

req.header['X-JWT-Signature'] = signature;
```

If an `X-JWT-Signature` appears to the server, it will attempt to validate the connecting clients request, either erroring or passing through.


