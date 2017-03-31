Create a RSS Feed Channel :
```
POST /rest/channel
{
 action : "syndication.feed",
 name : "Email > RSS Feed"
 config : {
 }
}

RESPONSE
{
 id : "rss channel id"
}
```

Create a SMTP  bip with a source edge pointing to RSS Feed
```
POST /rest/bip
{
 type : "smtp",
 hub: {
  source: {
    transforms: {
      "rss channel id": {
        description: "[%source#body_html%]",
        title: "[%source#subject%]"
      }
    },
    edges: [ "rss channel id" ]
  }
}
}

RESPONSE
{
 name : "lcasKQosWire22" // auto generated
 _repr : "lcasKQosWire22@yourdomain.net"
}
```