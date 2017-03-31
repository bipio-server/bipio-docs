#Domain

`/rest/domain`

The Domain resource lets you attach A/CNAME/MX resource records for external domains to your account for use as a bip domain_id. Domains can also serve channel content by pointing to a channel renderer.  A default 'vanity' system domain is installed when a new account is  boarded, of the form {username}.{localdomain}.  Domains marked as `type : "vanity"` are immutable. ie: they can not  be renamed or deleted.

### Decorators

 * **_href** (URI) Fully Qualified Resource URI
 * **_repr**  (String) Derived representation

### Attributes

**id** (string, UUID) Domain UUID

**name** (string, required) [FQDN](http://en.wikipedia.org/wiki/Fully_qualified_domain_name)

**renderer** (object, optional) renderer structured keyed by
* channel_id (string, UUID) Channel ID
* renderer (string) Channel renderer name

Where no renderer structure has been supplied, HTTP requests to the domain will return a 404

### Sample Request
```
GET /rest/domain/
{
  "id": "664616d3-5caf-ab09-b398-000012b5e920",
  "name": "docuser.bip.io",
  "renderer" : {
    "channel_id" : "61bea7bc-37dd-3368-9b36-00006fa6319e",
    "renderer" : "rss"
  },
  "_repr": "docuser.bip.io",
  "_href": "https://api.bip.io/rest/domain/664616d3-5caf-ab09-b398-000012b5e920"
}
```

### RPC : Domain Confirm

The domain confirm rpc, `/rpc/domain/confirm/:domain_id`, Checks that an attached domain resolves to a CNAME or MX record pointing to the domain owners default 'vanity' account.  A sample zone file may look like :

<pre>
bip.customdomain.net.	300	IN	CNAME	admin.bip.local.
bip.customdomain.net.	300	IN	CNAME	admin.bip.local.
admin.bip.local.		86400	IN	CNAME	bip.local.
bip.local.			86400	IN	MX	10 mail.bip.local.
</pre>

`/rpc/domain/confirm/:domain_id` returns either 200 OK, 202 Accepted (If unverified) or 409 Conflict if the domain is no longer internet resolvable.  409 will not change the availability status of the `domain` resource, think of 409's as a system warning.



