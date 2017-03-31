Creates a Bip using default settings, where name has been derived from the domain portion of either a HTTP Referer header or explicit referer argument. 

This resource is a /rest/bip wrapper and supports GET requests only. The REST interface for the generated Bip can be accessed via the returned _href decorator.

```
GET /rpc/bip/create_from_referer?referer=http://news.ycombinator.com/user?id=feralmoan HTTP/1.1
```

```
{
  id: "bc928113-0a98-4975-a821-98373aa72551",
  name: "ycombinator",
  domain_id: "31b3a2db-4ea4-d1c8-b35d-00004d00b4d7",
  type: "smtp",
  config: { },
  hub: {
    source: {
      edges: [
        "05de2c02-7ec6-4be8-d3db-00006a8ed73e"
      ]
    }
  },
  note: "via news.ycombinator.org",
  end_life: {
    time: 0,
    imp: 0
  },
  paused: false,
  icon: "https://bip.io/static/img/cdn/icofactory/9d99e2ad9a751b7850f5a00a9c184c62.ico",
  created: "1358816085282",
  _imp_actual: 0,
  _repr: "ycombinator@docs.bip.io",
  _href: "https://api.bip.io/rest/bip/bc928113-0a98-4975-a821-98373aa72552"
}
```