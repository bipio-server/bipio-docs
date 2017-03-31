Transforms are used by Bip `hub` objects to map and combine attributes between adjacent channels.  They are a JSON object where the object keys are the named imports of a target channel on a hub and the value is the data to inject, evaluated as a text template.

For example if we have an [email.smtp_forward channel](https://bip.io/docs/pods/email) and we want to set two of its imports, `subject` and `body_text`. We can inject custom values like so : 

```
{
  "subject" : "You Got Mail!",
  "body_text" : "An important message"
}
```

Templates can also be interpolated with variables from upstream channels or metadata if they take the form 

`[%(source|_client|_bip|channel id)#json_path%]`

`json_path` in the example means the [JSON Path](http://goessner.net/articles/JsonPath/) of an attribute exported by an upstream channel, keyed by either an explicit channel id, or `source` (ie: whatever the bip receives or generates). This means you can concatenate exports and text together to create a custom import.  With the previous email example, lets assume we're using an `smtp` bip and want to pass through some of the details to an email channel on its hub : 

```
{
  "subject" : "[%source#subject%]",
  "body_text" : "I got an email from [%_client#repr%] : [%source#body_text%]"
}
```

## Object and Array Passthrough

Transform templates which only include a single JSONPath will be evaluated in-place, meaning that if the path evaluates to an object or array, then it will be replaced with that structured data.

For example, say we have a channel with a `json_document` import which expects a structured object and you need to map an export object from a complex payload like so (the 2nd object element of an array) : 

```
{
  "374d9a1d-cc84-456d-9dad-e1e3065e8c4d" : {
    "payload" : [
      "Payload Title",
      {
        "name" : "This is the document name",
        "body" : {
          "title" : "Document Title",
          "message" : "Document Body"
        }
      }
    ]
  }
}
```

It can transformed as : 

```
{
  "json_document" : "[%374d9a1d-cc84-456d-9dad-e1e3065e8c4d#payload[1].body%]"
}
```

Or to take the previous email forwarder example, we can just keep on drilling into the object to find what we're looking for : 

```
{
  "subject" : "[%374d9a1d-cc84-456d-9dad-e1e3065e8c4d#payload[1].body.title%]",
  "body_text" : "[%374d9a1d-cc84-456d-9dad-e1e3065e8c4d#payload[1].body.message%]"
}
```

Easy, right?

## Bip metadata exports (_bip|_client)

Additional metadata exports are available depending on the type of Bip that is evaluating. These exports are set in `_bip` and `_client` exports which can be discovered by calling the [`/rpc/describe/bip`](https://github.com/bipio-server/bipio/wiki/Describing-Models) RPC.

