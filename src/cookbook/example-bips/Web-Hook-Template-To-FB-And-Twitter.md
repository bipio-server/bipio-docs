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

Create a Facebook Wall Post Channel
```
POST /rest/channel
{
 action : "facebook.post_timeline_mine",
 name : "Post To My Timeline"
 config : {
 }
}

RESPONSE
{
 id : "facebook channel id"
}
```

Create a Twitter Status Update
```
POST /rest/channel
{
 action : "twitter.status_update",
 name : "Twitter Status Update"
 config : {
 }
}

RESPONSE
{
 id : "twitter channel id"
}
```

Create a HTTP bip with a source edge pointing to Templater, with 2 edges pointing to Facebook + Twitter
```
POST /rest/bip
{
 type : "http",
  "hub": {
    "template channel id": {
      "transforms": {
        "facebook channel id": {
          "message": "[%template channel id#message%]"
        },
        "twitter channel id": {
          "status": "[%template channel id#message%]"
        }
      },
      "edges": [
        "twitter channel id",
        "facebook channel id"
      ]
    },
    "source": {
      "transforms": {
        "template channel id": {
          "message": "New Status  [%source#title%]"
        }
      },
      "edges": [
        "template channel id"
      ]
    }
  }
}

RESPONSE
{
 name : "J6J5IVA" // auto generated
 _repr : "http://localhost/bip/http/J6J5IVA"
}
```
you can then fanout a message by calling http://localhost/bip/http/J6J5IVA?title=hi there!









