Rendering a HTTP Bip means that you are responding to a connecting HTTP client with a Payload, Content-Type and Encoding.  It's a way of surfacing otherwise protected channel content without relinquishing sensitive information about your account or application.  Rendering channel data also means you can server that data while inheriting the core characteristics of a bip - authentication, client binding, domain namespacing, lifetime and hub resolution.

Without a renderer, HTTP Bips will simply respond with a JSON packet that says '200 OK' which means 'the graph is valid and is trying to resolve'.

You can set the preferred renderer for your HTTP bips by setting the `renderer` config option for bips of `type : "http"`, with the target  `channel_id` and system defined `renderer` string :

```
"config": {
  "auth": "none",
  "renderer" : {
    "channel_id" : "d4dc7bbc-226f-444b-a68d-9024c0fcd34d",
    "renderer" : "rss"    
  }
}
```

Not all channels have renderers, available renderers can be retrieved by either describing the pod with `/rpc/describe/pod/{pod name}` or retrieving the target channel with `/rest/channel/{channel id}`.  The `renderer` name in the http bip config will be the renderer key.

### Do Rendering Bips still have hubs?

Yes they can, but they're not mandatory.  A HTTP Bip with a renderer behaves just like any normal http endpoint, whatever the client posts to a rendered HTTP Bip will still be processed by the configured hub if one is present.  The renderer will just respond to them in a different way (perhaps by serving a file, or giving a hit count etc).  Renderers do not generate exports onto their parent bip's hub, renderers are invoked parallel to hub processing.


