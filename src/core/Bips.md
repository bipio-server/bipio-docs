# Bips

`/rest/bip`

<img align="right" src="https://bip.io/static/img/docs/complex_hub_example.png" style="float:right"/>
Bips are ephemeral endpoints which consume or emit messages to be transformed or relayed across many different services over a [graph](http://en.wikipedia.org/wiki/Directed_graph) based <a href="http://en.wikipedia.org/wiki/Pipeline_(software)">pipeline</a> called a hub. They act as a thin layer between the outside world and private channels enabled on an account, and orchestrate the interactions between different component services.

The structures also contain metadata defining the flavor, lifespan and overall characteristics of the endpoint or trigger.

Some of their characteristics include :

 - dynamic or automatically derived naming
 - pausing or self-destructing after a certain time or impressions volume
 - binding to connecting clients with soft ACLs over the course of their 'life'
 - able to be reconfigured dynamically without changing a client implementation
 - infinitely extensible, from any channel to any other channel.
 - can serve (render) protected channel content while inheriting all of the above characteristics

## 3 Flavors

There's a few different types of bip which you can use to perform work which have been selected to address some common use cases.  They are SMTP (Email), HTTP (Web Hooks) and Triggers (Event Emitters) and indicate which protocol a bip should listen on or which event to fire.  When configuring a bip the `type` and `config` parameters will indicate the bips overarching behavior.

**smtp** is an SMTP endpoint (email address/alias) which acts as any other email address but is an inbound receiver only.  smtp bips accept email and then distribute that message including any attachments across their delivery graph (hub).

**http** is a web hook which can accept GET/POST requests and push whatever messages it receives across the hub.  PUT/DELETE is not supported.

**trigger** is managed by the trigger scheduler/cron and has no public facing endpoint.  Triggers are bound to a certain class of action/channel called an emitter, and they fire periodically to poll for changes or new messages from whichever channel they're bound to.

Files can be posted to http bips, attached to smtp bips, appear via triggers or be generated by channels on a hub.

## Attributes

**name** (string, optional) is the unique name which becomes part of the Email, Webook or Trigger endpoint you create. For smtp bips, `name` should be an [RFC821](http://tools.ietf.org/html/rfc821) parsable (mailbox portion) email address.  When a name has not been supplied the system will create a unique short name automatically in its place.

**domain_id** (UUID, optional) Because bips are named enpoints, they can be attached (softly) to specific domains and namespaced to an app or subdomian.  `domain_id` is the id pointer to the domains resource the bip should listen on.  If `domain_id` is not supplied on bip creation, the default `account_option`.`bip_domain_id` will be applied.

**note** (text, optional) any extra notes you want to attach to this bip can be put here.

**end_life** (object, optional) is a simple expiry structure which indicates at what time, or after how many impressions, this bip should expire.  eg:

    {
      time : '+1d',
      imp : 10,
      action : 'pause'
    }

`time` is any [datejs](http://www.datejs.com/) parsable time or UTC timestamp.  When expiries are saved in a parsable string format, they are automatically converted to UTC.

`imp` is an integer which defines the upper limit of impressions for this bip.

`action` is applied to either `pause` or `delete` the bip when either of `time` or `imp` conditions are met.

`end_life` is only enforced if either `time` or `imp` are present.  If they're skipped on POST and you have an `account_option` with a default `end_life` structure, that setting will apply.  Similarly, if `action` has not been supplied the `account_option`.`bip_expiry_behavior` setting will apply.

To skip all expiry, set `end_life` and `time` to `0`.

**paused** (boolean, optional) Paused bips are still present in the system but do not actively respond to requests, or in the case of Triggers, do not poll for content or emit events.

**binder** (string array, optional) Array of IPV4,IPV6 or sender email addresses or [ 'first' ].  Use 'first' to bind with the first connecting client. `binder` is a soft ACL which performs an IP/Email sender check before processing.

**app_id** (string, optional) Application Tag, for when you're building an app which needs to track and manage the Bips it creates.

**icon** (string, optional) Sometimes you can have so many bips that its hard to tell looking at them what they do or where they're from.  You can add an optional icon image to a bip for rendering to make them easier to identify.  If a bip has been created with a HTTP REFERER header, and that referer domain has a favicon.ico, `icon` Bipio will automatically grab that icon and inject it into config.

**type** (string, optional, http|smtp|trigger) Indicates the type of bip this should be.
* `http` is a HTTP endpoint, which resolve to http://{username}.{host}/bip/http/{bip name}
* `smtp` is an inbound email alias, {bip name}@{username}.{host}
* `trigger` will invoke its emitter channel as specified in `config`, periodically

**config** (object) Type Specific Config.

- **For `http`**
  * **exports** is a JSON Schema of attributes for transform hinting. The system provides two default exports 'for free' which are interpreted as query parameters for the purpose of generating transforms, `title` (string) and `body` (string)
  * **auth** (string) Auth means the HTTP Basic Auth credentials that are required by a client of this HTTP bip. String of type :
    * `none` Disables authentication
    * `token` To use default account token (Basic Auth)
    * `basic` To use custom username/password (Basic Auth)
  * **username** (string) http basic username, where auth = `basic`
  * **password** (string) http basic password, where auth = `basic`
  * **renderer** (object) Allows Bips to serve Channel content directly while inheriting 'bip-like' characteristics (lifespan, custom credentials etc).  HTTP Bips with a `renderer` setting make `hub` configs non-mandatory. Object keyed by :
    * `channel_id` Target Channel Id
    * `renderer` Pod Renderer name
    * `query` Additional URI GET query string without prefixing '?'.  Any additional parameters passed into the bip will append to this query.

- **For `trigger`**

  * **channel_id** Triggering Channel Id, must be a Channel marked as an emitter with `_emitter : true`.

**hub** (object, optional) The hub is the most complex part of a bip, it does all the work.  Hub is a graph structure where each vertex is a 'channel', and every edge defines a data transform mapping the `export` (output) from a parent channel to the `import` (input) of the target channel.  Hubs are always processed starting with the `source` vertex, which is the bip content source.  Every channel (including source) which exports data upstream uses this object structure, keyed by 'source' or export creating channel id :

  * **{source|channel id}** (object)
    * **edges** (array) Array of target channel id's
    * **transforms** (object, optional) export > import transformation rules, keyed to target channel id.
      * **{channel id}** ([transform object](https://github.com/bipio-server/bipio/wiki/Transforms-And-Templates)) key/value list of channel id's imports : parent export.

## Decorators

 * **_href** (URI) Fully Qualified Resource URI
 * **_repr**  (String) Derived representation
 * **\_imp\_actual** (Integer) Number of impressions
 * **_links** (array) Resource links. see `rel: "_repr"` for JSON-Schema and required resource attributes


### Some examples

A simple Email Repeater, lets say you have an `email.smtp_forward` channel (id `d8c35967-d9f4-427b-9aaf-bd542d5e2931`) and you want to map an SMTP bip's exports in a 1:1 import match to this channel.  Visually it may look like so :

![Email Repeater](https://bip.io/static/img/docs/resource_rest_bip_hubs_1.png)

The hub would be :

```
"hub": {
  "source": {
    "transforms": {
      "d8c35967-d9f4-427b-9aaf-bd542d5e2931": {
        "reply_to": "[%source#reply_to%]",
        "body_text": "[%source#body_text%]",
        "body_html": "[%source#body_html%]",
        "subject": "[%source#subject%]"
      }
    },
    "edges": [
      "d8c35967-d9f4-427b-9aaf-bd542d5e2931"
    ]
  }
}
```

***

A more complex example, with a HTTP Bip exporting to an email and an optionally filtered RSS Channel

![Web Hook > Email > Filtered RSS](https://bip.io/static/img/docs/resource_rest_bip_hubs_2.png)

```
"hub": {
  "source": {
    "transforms": {
      "d8c35967-d9f4-427b-9aaf-bd542d5e2931": {
        "body_html": "[%source#body%]",
        "subject": "[%source#title%]"
      }
    },
    "edges": [
      "d8c35967-d9f4-427b-9aaf-bd542d5e2931",
      "bc756313-1354-4627-b2a7-9de6e73b4bb7"
    ]
  },
  "bc756313-1354-4627-b2a7-9de6e73b4bb7": {
    "transforms": {
      "d4dc7bbc-226f-444b-a68d-9024c0fcd34d": {
        "author": "[%_client#repr%]",
        "description": "[%source#body%]",
        "title": "[%source#title%]"
      }
    },
    "edges": [
      "d4dc7bbc-226f-444b-a68d-9024c0fcd34d"
    ]
  }
}
```

### FYI

The easiest way to create these graphs programmatically if they become complicated or unwieldy to model is to sign into [bipio](https://bip.io) and mount your local install.  After creating your bip visually, grab which JSON parts you need from the Data View in the bip's config for insertion into your own application logic :

![Data View](https://bip.io/static/img/docs/data_view_sample.png)


## Request/Response Example

### Request
```
POST /rest/bip

{
  "domain_id": "5129117f-ed18-9949-7bb1-0000046dacc2",
  "type": "smtp",
  "config": [
  ],
  "hub": {
    "source": {
      "edges": [
        "d8c35967-d9f4-427b-9aaf-bd542d5e2931"
      ],
      "transforms": {
        "d8c35967-d9f4-427b-9aaf-bd542d5e2931": {
          "subject": "[%source#subject%]",
          "body_html": "[%source#body_html%]",
          "body_text": "[%source#body_text%]",
          "reply_to": "[%source#reply_to%]"
        }
      }
    }
  },
  "icon": "",
  "note": "",
  "end_life": {
      "action": "delete",
      "time": 0,
      "imp": 0
  },
  "paused": false
}
```

### Response
```
{
  "id": "a9278740-9837-4fe9-b968-2a0778d54a84",
  "name": "JA4CfS7",
  "domain_id": "5129117f-ed18-9949-7bb1-0000046dacc2",
  "type": "smtp",
  "config": [
  ],
  "hub": {
    "source": {
      "edges": [
        "d8c35967-d9f4-427b-9aaf-bd542d5e2931"
      ],
      "transforms": {
        "d8c35967-d9f4-427b-9aaf-bd542d5e2931": {
          "subject": "[%source#subject%]",
          "body_html": "[%source#body_html%]",
          "body_text": "[%source#body_text%]",
          "reply_to": "[%source#reply_to%]"
        }
      }
    }
  },
  "icon": "",
  "note": "",
  "end_life": {
      "action": "delete",
      "time": 0,
      "imp": 0
  },
  "paused": false,
  "_repr": "JA4CfS7@admin.bipio.local",
  "binder": [
  ],
  "app_id": "",
  "created": "1386306162162",
  "_imp_actual": 0,
  "_href": "http://bipio.local:5000/rest/bip/a9278740-9837-4fe9-b968-2a0778d54a84"
}
```