# Account Options

`/rest/account_option`

Account Options are general purpose settings which can be explicit or implicitly used across your account when modifying resources. This resource is a singleton instance and may neither be POSTed to or DELETEd

### Decorators

 * **_href** (URI) Fully Qualified Resource URI
 * **_repr**  (String) Derived representation

### Attributes

**id** (string, UUID) Unique Account Option ID. Discover this id by listing the resource /rest/account_option

**avatar**	String, URL	User Avatar

**timezone**	String	IANA UTC Offset or TZ eg: UTC+04:00 or Asia/Dubai

**bip_domain_id**	String	Bip Create, Default Domain ID

**bip_type**	String	Bip Create, Default Type

**bip_config**	Object	Bip Create, Default Config (must honor bip_type)

**bip_end_life**	Object	Bip Create, Default End Life Object

**bip_expire_behaviour**	String	Action to take on a bip once it expires, One of pause or delete

**bip_hub**	Object	Bip Create, Default Hub

**remote_settings**	Object	Ad-hoc settings for remotely managed accounts

### Sample Request
`GET /rest/account_option/38e65bd6-90b4-1a48-0b04-0000237912ef`

```
{
    id: "38e65bd6-90b4-1a48-0b04-0000237912ef",
    bip_hub: {
        source: {
            edges: [
                "05de2c02-7ec6-4be8-d3db-00006a8ed73e"
            ]
        },
        transforms: {
          "05de2c02-7ec6-4be8-d3db-00006a8ed73e" : "default"
        }
    },
    bip_domain_id: "31b3a2db-4ea4-d1c8-b35d-00004d00b4d7",
    bip_end_life: {
        imp: 20,
        time: "+1m"
    },
    bip_type: "smtp",
    bip_expire_behaviour: "pause",
    timezone: "America/New_York",
    avatar: "https://docs.bip.io/avatar/photo.png",
    _repr: "Account Options",
    _href: "https://api.bip.io/rest/account_option/38e65bd6-90b4-1a48-0b04-0000237912ef"
}
```

### RPC : Set Default

The Bip `/rpc/bip/set_default/:bip_id` RPC actually applies to the `account_option` resource, and sets the default Bip configuration when POSTing a Bip that has an empty body, or only partial data.  set_default takes the hub, domain, end_life, type and config from the supplied bip id and makes it default.

```
GET /rpc/bip/set_default/b750dd86-793c-485b-940a-9782a146aa18

200 Ok
{
  message : 'OK'
}
```




