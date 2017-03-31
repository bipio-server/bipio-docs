Certain entities in BipIO can be 'described' to programmatically discover characteristics about resources using a variant of [JSON Schema](http://json-schema.org).  To describe a resource, use the convention :

`/rpc/describe/:model/:type?`

Where model is one of :

#### bip

```
{
  "*": {
    "properties": {
      "_files": {
        "type": "array",
        "description": "File Objects"
      },
      "_client": {
        "type": "string",
        "description": "Sender Info",
        "oneOf": [
        {
          "$ref": "#/definitions/client_attribute"
        }
        ]
      },
      "_bip": {
        "type": "string",
        "description": "Bip Info",
        "oneOf": [
        {
          "$ref": "#/definitions/bip_attribute"
        }
        ]
      }
    },
    "definitions": {
      "client_attribute": {
        "description": "Connecting client attributes",
        "enum": [
        "host",
        "repr"
        ]
      },
      "bip_attribute": {
        "description": "This Bip's attribute",
        "enum": [
        "name",
        "type",
        "config",
        "_repr"
        ]
      }
    }
  },
  "smtp": {
    "properties": {
      "subject": {
        "type": "string",
        "description": "Message Subject"
      },
      "body_text": {
        "type": "string",
        "description": "Text Message Body"
      },
      "body_html": {
        "type": "string",
        "description": "HTML Message Body"
      },
      "reply_to": {
        "type": "string",
        "description": "Sender"
      }
    },
    "definitions": {}
  },
  "http": {
    "properties": {
      "title": {
        "description": "Message Title"
      },
      "body": {
        "description": "Message Body"
      }
    },
    "definitions": {}
  },
  "trigger": {
    "properties": {},
    "definitions": {}
  }
}
```

#### pod
`/rpc/describe/:model/:type?`  for `pod` optionally takes a type as the pod name. Omitting type will return all descriptions for all pods. 

eg: `/rpc/describe/pod/facebook`

```
{
  "email": {
    "name": "email",
    "description": "Email",
    "auth": {
      "type": "none",
      "status": "accepted"
    },
    "actions": {
      "smtp_forward": {
        "description": "Send an Email",
        "description_long": "Use to forward email messages to a chosen recipient (requires recipient verification)",
        "auth_required": false,
        "trigger": false,
        "singleton": false,
        "config": {
          "properties": {
            "rcpt_to": {
              "type": "string",
              "description": "Email Address (eg: foo@bar.com)",
              "optional": false,
              "unique": true,
              "validate": [
              {
                "pattern": "email",
                "msg": "Invalid Email"
              }
              ]
            }
          }
        },
        "renderers": {
          "verify": {
            "description": "Recipient Verify",
            "description_long": "Verifies this email channel recipient with a secret key sent to their inbox",
            "contentType": "text/html",
            "_href": "http://michael.dev-local.bip.io/rpc/render/channel/d8c35967-d9f4-427b-9aaf-bd542d5e2931/verify"
          }
        },
        "defaults": {},
        "exports": {
          "properties": {
            "response_code": {
              "description": "SMTP Response Code"
            },
            "response_message": {
              "description": "SMTP Response Message"
            }
          }
        },
        "imports": {
          "properties": {
            "subject": {
              "description": "Message Subject"
            },
            "body_html": {
              "description": "HTML Message Body"
            },
            "body_text": {
              "description": "Text Message Body"
            },
            "reply_to": {
              "description": "Reply To"
            }
          }
        }
      }
    }
  }
}
```


