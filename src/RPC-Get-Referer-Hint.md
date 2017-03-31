`/rpc/get_referer_hint`

Given a HTTP Referer header or explicit referer argument, returns a semantically 'valuable' referer name.  Referer argument takes precedence over HTTP Referer header.

```
GET /rpc/get_referer?referer=http://news.ycombinator.com/user?id=feralmoan HTTP/1.1

{
    hint: "ycombninator",
    referer: "http://news.ycombinator.com/user?id=feralmoan",
    scheme : "http"
}
```