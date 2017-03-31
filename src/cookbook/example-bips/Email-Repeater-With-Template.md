Create a SMTP Forwarder Channel :
```
POST /rest/channel
{
 action : "email.smtp_forward",
 name : "Helo FuBa"
 config : {
   "rcpt_to" : "foo@bar.net"
 }
}

RESPONSE
{
 id : "email channel id"
}
```

Create a Template Channel
```
POST /rest/channel
{
 action : "template.text_template",
 name : "Generic Wrapper"
 config : {
 }
}

RESPONSE
{
 id : "template channel id"
}
```

Create a SMTP  bip with a source edge pointing to My Template, who has an edge to "Helo FuBa"
```
POST /rest/bip
{
 type : "smtp",
 hub: {
  source: {
   transforms: {
    "template channel id": {
     "message": "Here's a template wrapper for the email, which says : '[%source#body_text%]'"
    }
   },
   "edges": [ "template channel id" ]
  },
  "template channel id": {
    "transforms": {
      "email channel id": {
        "body_text": "[%template channel id#message%]",
        "subject": "[%source#subject%]"
      }
    },
    "edges": [ "email channel id" ]
  }
 }
}

RESPONSE
{
 name : "lcasKQosWire22" // auto generated
 _repr : "lcasKQosWire22@yourdomain.net"
}
```