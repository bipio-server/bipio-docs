# Channels

`/rest/channel`

A Channel is an instance of a Pod's method, a reusable entity which performs a discrete unit of work and emits a predictable result. The collection of channels you create becomes something like a swatch from which you can orchestrate complex API workflows. When dropped onto a bip's graph, a channels export then becomes the next adjacent channels transformed import.

### Actions

Channels which point to a Pods Action and are not marked as an 'emitter' can be used anywhere on a bip's graph.  Action channels are passive pointers, they are only invoked whenever messages are routed to them.

### Emitters

Emitter Channels are a special class of Channel which, when used in conjunction with a Trigger Bip, generate their own content (events).  Emitters may not be placed onto a Bip's `hub`, they can only be used for Bips of `type : "trigger"`.  To determine which actions can be created as triggers, check the Pod's schema.

### Attributes
**id** (uuid) Channel ID

**name** (string) Channel Name

**note** (text) Additional Channel description

**action** (string) A named identifier for the action or emitter. This is the symbolic pointer to a Pods method and take the normalized form `{pod name}.{action name}` (lowercase).  Actions can be discovered by either checking the [bipio website](https://bip.io/docs/pods) or programattically by [Describing the Pod](https://github.com/bipio-server/bipio/wiki/Describing-Models#pod).  Pod name and action name will be the hierarchical keys in the returned json.  For example, `email.smtp_forward` can be found in the Pod schema as :

![How To Find an Action](https://bip.io/static/img/docs/find_action.png)


For attributes marked as JSON Schema (config/exports/imports), refer to ([http://json-schema.org](http://json-schema.org))


**config** Account or instance specific configuration, such as default imports, static flags etc. Configs are different for every action.  The required configuration for your target channel can be surfaced by [Describing the Pod](https://github.com/bipio-server/bipio/wiki/Describing-Models#pod)

**app_id** (string, optional) Application Tag, for when you're building an app which needs to track and manage the Channels it creates.


### Decorators

 * **_href** (URI) Fully Qualified Resource URI
 * **_repr**  (String) Derived representation
 * **_renderers** (Object) Available Renderers
 * **_available**  (Boolean) Setup Complete, Channel is available.  Will be false if further setup is required, refer to the target Pod's documentation to see what conditions a Channel needs to satisfy to become 'available'.

### Singletons

For some actions, it makes no sense to have two instances of the same kind present at any time.  These actions are marked as `singleton`.  The system doesn't prohibit multiple instances of singleton's, but use this flag as a guide when creating Channels in an automated fashion.  As a rule, singletons don't require user config to operate and when a Pod with singletons is enable by a user (via oAuth for instance) - these Channels will be automatically created.

## Request/Response Example

### Request

```
POST /rest/channel

{
 action : "email.smtp_forward",
 name : "Helo FuBa"
 config : {
   rcpt_to : "foo@bar.net"
 }
}
```

### Response
```
{
  "id": "2b0fe061-b37c-4928-be32-b8a9c5194dd7",
  "name": "Helo FuBa",
  "action": "email.smtp_forward",
  "config": {
    "rcpt_to" : "foo@bar.net"
  },
  "note": "",
  "icon": "",
  "created": "1389254027417",
  "_repr": "Use to forward email messages to a chosen recipient (requires recipient verification)",
  "_href": "http://admin.local:5000/rest/channel/2b0fe061-b37c-4928-be32-b8a9c5194dd7",
  "_renderers": {
    "verify": {
      "description": "Recipient Verify",
      "description_long": "Verifies this email channel recipient with a secret key sent to their inbox",
      "contentType": "text/html",
      "_href": "http://docs.admin.local/rpc/render/channel/d8c35967-d9f4-427b-9aaf-bd542d5e2931/verify"
    }
  }
}
```

#### Channel Renderers

 Channel level renderers can answer requests about their internal state or potentially serve stored data to authenticated clients.  There is no standard around renderers other than they answer some type of request over HTTP.  Available renderers for the channel will be detailed in the `_renderers` decorator.

Every configured Channel will automatically have an `invoke` renderer which lets you directly call a channel without it having to be part of a 'bip'.  To determine the parameters an `invoke` renderer requires, refer to its pod import schema.

```
"_renderers": {
  "verify": {
    "description": "Recipient Verify",
    "description_long": "Verifies this email channel recipient with a secret key sent to their inbox",
    "contentType": "text/html",
    "_href": "http://docs.admin.local/rpc/render/channel/d8c35967-d9f4-427b-9aaf-bd542d5e2931/verify"
  },
  "invoke": {
    "description": "Invoke",
    "description_long": "Invokes the Channel with ad-hoc imports",
    "contentType": "application/json",
    "_href": "http://docs.admin.local/rpc/render/channel/d8c35967-d9f4-427b-9aaf-bd542d5e2931/invoke"
  }
}
```

 * **description** (string) Short renderer description
 * **description_long** (string) Long renderer description
 * **contentType** (string) Response Content Type
 * **_href** (string) Renderer URI (direct call)






