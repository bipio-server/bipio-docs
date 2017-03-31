Domain Renderers work just like HTTP Renderers, as in they serve content to connecting clients via a renderer attached to one of your channels for one of your custom domains.  Domain Renderers are configured by PUTting to the Domain resource with a renderer option :

```
"renderer" : {
  "channel_id" : "d4dc7bbc-226f-444b-a68d-9024c0fcd34d",
  "renderer" : "rss"    
}
```

Unlike HTTP Renderers, Domain Renderers are persistent and will currently not ask for authentication!  With that in mind, its obviously bad form to expose a sensitive channel with a domain renderer.
