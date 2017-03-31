---
isIndex: true
versions: [3,4,5]
booleans: true
strings: hello world
objects: {"foo":"bar", "yoo":"zoo"}
---

# Getting Started

Bipio is a lightweight [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) [JSON](http://www.json.org/) [API](http://en.wikipedia.org/wiki/Representational_state_transfer#RESTful_web_APIs) ontop of [ExpressJS](http://expressjs.com).  It's an API orchestration platform, REST/RPC and ephemeral endpoint server.  Continue below and you'll soon be on your way to creating useful graphs!

## Contents

* [API](#api)
 * [Endpoints](#endpoints)
 * [Authentication](#authentication)
 * [REST Endpoints](#rest)
 * [RPC Endpoints](#rpc)
* [Config](#config)
* Hosted Customers
 * [About SMTP Endpoints](#a-note-on-smtp-bip-endpoints)
 * [Rate Limiting](#rate-limiting)


## Useful why?

There are many reasons to use an ephemeral graph system, here's some highlights

- message delivery implementations are trivial to refactor as vertices can be swapped in-place dynamically. Changes to client code is highly unlikely.

- vertices in the graphs have no other system concerns but the 'one thing they do well', given knowledge of immediately adjacent edges they have everything they need to scale horizontally and vertically.

- graph structures are a natural fit for a <a href="http://en.wikipedia.org/wiki/Pipeline_(software)">pipe and filter</a> pattern, as they can visually describe messsage pathways and model potentially complex workflows.

- once a Bip expires or is otherwised removed, replays are impossible.  On expiry, Bips disappear forever, this means temporal endpoints cannot be discovered or interrogated. for example : `/bip/http/abc123` may do abc, or 123, or xyz, and it may or may not exist. Similarly nothing about the endpoint needs to have a name with any semantic value.  The underlying delivery strategy for a single endpoint may be constantly changing.

### So how does it work?

When you define a bip, you are defining the characteristics of a named graph.  SMTP and HTTP bip payloads are normalized for each respective protocol, and trigger content is normalized from the channel that is invoked.  SMTP/HTTP bips are 'on-demand' and they fire whenever a new message is received.  Triggers are fired whenever the periodic scheduler requests it.

When a message is received or generated from a trigger, it enters the target bip's graph via the 'source' vertex/channel.  Any exports are then normalized and sent across adjacent edges to the next-nearest vertex via RabbitMQ for consumption as a new import.  The source message may be transformed in certain ways depending on your transform rules, and will continue to feed forward from 'source' until all vertices have been visited.

As a message is pushed through a graph, it builds a stack of imports from prior visited channels which can be further transformed and imported.  See the [bips section](docs/bips) for more info.

#### A note on files

Received or fetched files are not present as explicit imports/exports but rather appear to a hub when made available.  Certain channels will operate with the assumption that these files are present (eg: dropbox.save_file)

## API

The API is namespaced as RESTful resources, and RPC's with `/rest` and `/rpc` respectively. [JSONP](http://en.wikipedia.org/wiki/JSONP) is supported with a `callback=your_function` GET parameter.

### Endpoints

For https://{{host}}, there are two endpoints that you'll likely be using.

`http://api.{{host}}` for modifying system REST and RPC resources
`http://{username}.api.{{host}}` for transacting with your own HTTP Bips and Channel Renderers

### Authentication

The API uses [HTTP Basic Authentication](http://en.wikipedia.org/wiki/Basic_access_authentication).  Username will be your account username, and password is a generated API token.

`curl http://admin:4a4b27ec88763a3c371916d2e23a2000@bipio.local:5000/rest/bip/637658bb-eb15-4d59-9e0e-abb39021e40e`

When you set up BipIO for the first time, take note of the generated token for your primary account.  If a token has been misplaced, run `tools/token_regen.js {account uuid}` to regenerate a token for the target account uuid.

You can expose an account UUID by shelling into mongodb and running the appropriate query against the `accounts` collection.

### Response Codes

[HTTP Status Codes](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)

400 Error responses will generally be raised due to validation errors in the request payload. Errors are returned within the context of the resource being requested, with the message body of the form `errors.{attribute}.message`

### REST

  [REST Resources](http://en.wikipedia.org/wiki/Representational_state_transfer) honor GET/POST/PUT/DELETE/PATCH.

* [`/rest/account_option/:id?`](docs/account-options) POST/DELETE is not supported for `account_option`.
* [`/rest/bip/:id?`](docs/bips)
* [`/rest/channel/:id?`](docs/channels)
* [`/rest/domain/:id?`](docs/domains)

#### Decorators

  Most REST resources also have additional response decorators attached to each model which provides a little extra info.  Decorators are prefixed with an underscore and are read-only.  eg: `_href : "http://docs.{{host}}/rest/bip/bc928113-0a98-4975-a821-98373aa72552"`

The two most common are

 * **_href** (URI) Fully Qualified Resource URI
 * **_repr** (String) Derived representation.

#### Collections

If `id` has been omitted, GET will return a list of objects.  Lists accept `page`, `page_size`, `order_by` GET parameters.  The response models are keyed into `data`.

```
GET /rest/domain?page=1&page_size=10&order_by=recent

{
  "page": 1,
  "page_size": 10,
  "num_pages": 1,
  "order_by": "recent",
  "total": 2,
  "data": [
    {
      "id": "664616d3-5caf-ab09-b398-000012b5e920",
      "name": "docuser.{{host}}",
      "_repr": "docuser.{{host}}",
      "_href": "http://api.{{host}}/rest/domain/664616d3-5caf-ab09-b398-000012b5e920"
    },
    {
      "id": "61bea7bc-37dd-3368-9b36-00006fa6319e",
      "name": "mydomain.com",
      "_repr": "mydomain.com",
      "_href": "http://api.{{host}}/rest/domain/61bea7bc-37dd-3368-9b36-00006fa6319e"
    }
  ]
}
```

### RPC

[RPC's](http://en.wikipedia.org/wiki/Remote_procedure_call) provide certain behaviors and helpers for performing work, negotiating authentication or generating content.

* Describe a Model [`/rpc/describe/:model/:submodel`](docs/describing-models)
* Call a Channel Renderer [`/rpc/render/channel/:channel_id/:renderer`](docs/channels#channel-renderers)
* Negotiate OAuth [`/rpc/oauth/:pod_name/:auth_method`](docs/pods#oauth)
* Set Credential Tokens [`/rpc/issuer_token/:pod_name/:auth_method`](docs/pods#issuer-tokens)
* Get Referer [`/rpc/get_referer_hint`](docs/rpc-get-referer-hint)
* Create Bip from Referer [`/rpc/bip/create_from_referer`](docs/rpc-create-from-referer)
* Get Transform Hint [`/rpc/bip/get_transform_hint`](docs/rpc-get-transform-hint)
* Share a Bip [`/rpc/bip/share`](docs/rpc-share-bip)
* List Shares [`/rpc/bip/share/list`](docs/rpc-list-shared-bips)
* Unshare [`/rpc/bip/unshare`](docs/rpc-un-share-bip)
* Set Account Attribute [`/rpc/bip/set_default`](docs/account-options#rpc--set-default)
* Confirm Domain Delegation [`/rpc/domain/confirm`](docs/domains#rpc--domain-confirm)

## Config

Configuration files can be found under `/config/{environment}.json` where environment is the shell export NODE_ENV.  If NODE_ENV can not be found as an environment variable, `development` will be used.

The first time you setup bipio via `make install`, it will ask you some questions which populate into the config json file.  The template for this file is [`config.json-dist`](https://github.com/bipio-server/bipio/blob/master/config/config.json-dist)

#### Variables

* **domain_public** (string) public facing default domain (fqdn), including port # if applicable
* **website_public** (string) proxying website (user space oauth confirm for example)
* **oembed_host** (string) oembed rendering host
* **cdn_public** (string) default public assets URI
* **proto_public** (string) public protocol for resolving HTTP bip endpoints, http or https
* **crons** (object) periodic scheduler [Cron Expressions](http://en.wikipedia.org/wiki/Cron#CRON_expression)
  * **stat** (string) global stats runner
  * **trigger** (string) trigger runner
  * **expire** (string) bip expirer
* **timezone** (string) Timezone (eg: GMT, Asia/Tokyo etc)
* **server** (object) Server Config
  * **port** (integer) TCP Listen Port
  * **host** (string, optional) IP Address. Omit to listen on all interfaces
  * **sessionSecret** (string) autogenerated session secret
  * **forks** (integer)  #forks.  When empty, uses 1 fork/CPU.
  * **public_interfaces** (array, optional) list of resolvable IP's (V4|V6) for internal domain resolution. omit to autodiscover.
  * **ssl** (object, optional) key and certificate paths for SSL
    * **key** (string) key path
    * **cert** (string) certificate path
* **mailer** (object) Outbound Mailer Config
  * **port** (string) Relay Port
  * **host** (string) Relay host or IP
  * **auth** (object, optional) SMTP Authentication Credentials
    * **username** Username
    * **password** Password
* **dbMongo** (object) MongoDB Connect
  * **connect** (string) [Connect String URI](http://docs.mongodb.org/manual/reference/connection-string/)
* **data_dir** (string) file based data repo, relative to installation path
* **cdn** (string) file based cdn data (pointed to via cdn_public), relative to installation path
* **k** (object) AES Keychain, for encrypting private user space data by version.
  * **#** (string) version # = key, eg: `"5": "d767500f84eecec0d8944db8bb4a549f"`
* **auth** (object) user authentication strategy definition
  * **type** (string) one of 'native' (local mongodb server) or 'ldap' (LDAP server auth).  Default 'native'.
  * **config** (object) strategy config (ldap only at present)
    * **server** (object) [ldapjs](https://github.com/mcavage/node-ldapjs) constructor options
    * **filter** (object) [ldapjs](https://github.com/mcavage/node-ldapjs) search filter
    * **base** (string) dn base path
    * **auto_sync** (object, optional) enable local user create from ldap auth
      * **mail_field** (string) name of entity email field
* **jwtKey** JWT Key for signed requests [Learn More](docs/request-signing-with-jwt)
* **pods** (object) Pod Config.  Sparse Config populated via `tools/pod-install.js` see [Pods](docs/pods) for more info.
* **rabbit** (object) RabbitMQ Server + Queue Configs
  * **host** (string) RabbitMQ Host (FQDN)
  * **vhost** (string, optional) Virtual Host, including prefix slash, eg: `/bipio_production`
  * **auth** (object) RabbitMQ Client Authentication
    * **username** (string) Username
    * **password** (string) Password
  * **exchanges** (object) System Queue definitions
* **transforms** (object) Transform Corpus Sync
  * **fetch** (boolean) transform fetch enabled
  * **syncFrom** (string, URL) transforms source host

## Hosted User Notes

### A Note on SMTP Bip Endpoints

Bipio is not an SMTP Relay, Smart Host or 'Email Service' but rather an API provider that supports an SMTP transport. We do not suggest binding your custom domain MX to Bipio unless it is a dedicated subdomain. Set your subdomain CNAME/MX as `{username}.{{host}}`. For more info, see the [domains](docs/domains) section.

SMTP Bips rely on Haraka and some custom plugins which you can find in the [contrib repository ](https://github.com/bipio-server/bipio-contrib/tree/master/haraka)

### Rate Limiting

Your account and API access will be subject to a rate limiting policy. Should you experience HTTP 502 responses and feel this is in error, please reach us at support@{{host}}
