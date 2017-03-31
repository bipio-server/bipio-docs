Given a Text Template Channel :
```
POST /rest/channel
{
 action : "templater.text_template",
 name : "Ze Microfilm"
 config : {
   message : "Listen very carefully I shall say this only once"
 }
}

RESPONSE
{
 id : "template channel id"
}
```

... Create a HTTP bip with a channel renderer pointing to "Ze Microfilm" :
```
POST /rest/bip
{
 type : "http",
 hub : {
   "source" : {
      edges : [ ]
   }
 },
 config : {
  renderer : {
   channel_id : "template channel id",
   renderer : "invoke"
  }
 },
 end_life : {
   imp : 1
 }
}

RESPONSE
{
 name : "J8yg3ef" // auto generated
 _repr : "http://yourdomain.net/bip/http/J8yg3ef"
}
```

Depending on your `account_option`.`bip_expire_behavior` setting, this bip will either pause or delete after the first impression.

